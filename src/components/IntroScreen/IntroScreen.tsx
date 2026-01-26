import './IntroScreen.css';
import introScreenSvg from '../../assets/2 ЭКРАН.svg';

interface IntroScreenProps {
  onGo: () => void;
}

export default function IntroScreen({ onGo }: IntroScreenProps) {
  return (
    <div className="intro-screen">
      <div className="intro-stage" aria-hidden="true">
        <img className="intro-art" src={introScreenSvg} alt="" draggable={false} loading="eager" />
        {/* Clickable hit-area over the GO button inside the SVG mock (viewBox 440x956). */}
        <button className="intro-go-hit" onClick={onGo} aria-label="GO" type="button" />
      </div>
    </div>
  );
}


