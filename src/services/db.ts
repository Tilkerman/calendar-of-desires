import Dexie, { type Table } from 'dexie';
import type { Desire, Contact, ContactType } from '../types';

class CalendarOfDesiresDB extends Dexie {
  desires!: Table<Desire>;
  contacts!: Table<Contact>;

  constructor() {
    super('CalendarOfDesiresDB');
    this.version(2).stores({
      desires: 'id, isActive, createdAt',
      contacts: 'id, desireId, date, type, [desireId+date], createdAt',
    });
    // Версия 3: добавляем составной индекс [desireId+date+type] для оптимизации запросов
    this.version(3).stores({
      desires: 'id, isActive, createdAt',
      contacts: 'id, desireId, date, type, [desireId+date], [desireId+date+type], createdAt',
    });
  }
}

const db = new CalendarOfDesiresDB();

// Проверка инициализации базы данных
db.open()
  .then(() => {
    console.log('✅ База данных открыта успешно');
  })
  .catch((err) => {
    console.error('❌ Ошибка открытия базы данных:', err);
  });

// Методы для работы с желаниями
export const desireService = {
  async getActiveDesire(): Promise<Desire | undefined> {
    try {
      await db.open();
      return await db.desires.filter((d) => d.isActive === true).first();
    } catch (error) {
      console.error('Ошибка при получении активного желания:', error);
      return undefined;
    }
  },

  async getDesireById(id: string): Promise<Desire | undefined> {
    try {
      await db.open();
      return await db.desires.get(id);
    } catch (error) {
      console.error('Ошибка при получении желания:', error);
      return undefined;
    }
  },

  async createDesire(desire: Omit<Desire, 'id' | 'createdAt'>): Promise<string> {
    try {
      await db.open();
      const newDesire: Desire = {
        ...desire,
        details: desire.details || null, // Поддержка нового поля
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      await db.desires.add(newDesire);
      return newDesire.id;
    } catch (error) {
      console.error('Ошибка при создании желания:', error);
      throw error;
    }
  },

  async updateDesire(id: string, updates: Partial<Desire>): Promise<void> {
    await db.desires.update(id, updates);
  },

  async deleteDesire(id: string): Promise<void> {
    // Удаляем желание и все связанные контакты
    await db.desires.delete(id);
    await db.contacts.where('desireId').equals(id).delete();
  },

  async getAllDesires(): Promise<Desire[]> {
    try {
      await db.open();
      return await db.desires.orderBy('createdAt').reverse().toArray();
    } catch (error) {
      console.error('Ошибка при получении всех желаний:', error);
      return [];
    }
  },

  async setFocusDesire(id: string): Promise<void> {
    try {
      await db.open();
      // Деактивируем все желания
      await db.desires.filter((d) => d.isActive === true).modify({ isActive: false });
      // Активируем выбранное
      await db.desires.update(id, { isActive: true });
    } catch (error) {
      console.error('Ошибка при установке фокуса на желание:', error);
      throw error;
    }
  },
};

// Методы для работы с контактами
export const contactService = {
  // Получить контакт определенного типа за сегодня
  async getTodayContact(desireId: string, type: ContactType): Promise<Contact | undefined> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return await db.contacts
      .where('[desireId+date+type]')
      .equals([desireId, today, type])
      .first();
  },

  // Получить все контакты определенного типа за сегодня
  async getTodayContacts(desireId: string): Promise<Contact[]> {
    const today = new Date().toISOString().split('T')[0];
    return await db.contacts
      .where('[desireId+date]')
      .equals([desireId, today])
      .toArray();
  },

  // Создать или обновить контакт за сегодня
  async createOrUpdateContact(
    desireId: string,
    type: ContactType,
    text: string | null = null
  ): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    
    // Проверяем, есть ли уже контакт этого типа за сегодня
    const existing = await this.getTodayContact(desireId, type);
    
    if (existing) {
      // Обновляем существующий
      await db.contacts.update(existing.id, {
        text,
        createdAt: new Date().toISOString(),
      });
      return existing.id;
    } else {
      // Создаем новый
      const newContact: Contact = {
        id: crypto.randomUUID(),
        desireId,
        date: today,
        type,
        text,
        createdAt: new Date().toISOString(),
      };
      await db.contacts.add(newContact);
      return newContact.id;
    }
  },

  // Получить количество дней с контактом определенного типа за последние 7 дней
  async getContactDaysLast7Days(desireId: string, type: ContactType): Promise<number> {
    try {
      await db.open();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const datesWithContact = new Set<string>();

      // Получаем все контакты этого типа за последние 7 дней
      const allContacts = await db.contacts
        .where('desireId')
        .equals(desireId)
        .toArray();
      
      // Фильтруем по типу
      const filteredContacts = allContacts.filter((c) => c.type === type);

      // Проверяем каждый из последних 7 дней
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        // Проверяем, есть ли контакт этого типа в этот день
        const hasContact = filteredContacts.some((contact) => contact.date === dateStr);
        
        if (hasContact) {
          datesWithContact.add(dateStr);
        }
      }

      return datesWithContact.size;
    } catch (error) {
      console.error('Ошибка при подсчете контактов:', error);
      return 0;
    }
  },

  // Получить все контакты желания
  async getAllContacts(desireId: string): Promise<Contact[]> {
    const contacts = await db.contacts
      .where('desireId')
      .equals(desireId)
      .toArray();

    // Сортируем вручную по дате (новые сверху)
    contacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return contacts;
  },

  // Получить контакты определенного типа
  async getContactsByType(desireId: string, type: ContactType): Promise<Contact[]> {
    const contacts = await db.contacts
      .where('desireId')
      .equals(desireId)
      .toArray();

    const filtered = contacts.filter((c) => c.type === type);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return filtered;
  },

  // Удалить контакт
  async deleteContact(id: string): Promise<void> {
    await db.contacts.delete(id);
  },
};

export { db };
