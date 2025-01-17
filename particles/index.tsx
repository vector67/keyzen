import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ParticleSystemRenderer } from './particle-simulator';
import { useWindowSize } from './hooks';

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const getSequentialWordMap = (word: string): { [key: string]: string } => {
  // Creates a dictionary for a word like 'let' that looks like {l: 'e', e: 't', t: 'l'}
  const charArray = word.split('');
  const { length } = charArray;

  return Object.fromEntries(
    charArray.map((char, index) => [char, charArray[(index + 1) % length]]),
  );
};

const ParticleSystem = ({ timeLeft }: { timeLeft: number }) => {
  const particleSystemEnableWord = 'particle';

  const [particleSystemEnabled, setParticleSystemEnabled] = useState<boolean>();
  const [correctNextLetter, setCorrectNextLetter] = useState(particleSystemEnableWord.charAt(0));
  const handlePossiblyCorrectLetter = (key: string) => {
    const correctNextLetters = getSequentialWordMap(particleSystemEnableWord);

    if (key === correctNextLetter) {
      if (key === particleSystemEnableWord.charAt(particleSystemEnableWord.length - 1)) {
        setParticleSystemEnabled(!particleSystemEnabled);
      }
      setCorrectNextLetter(correctNextLetters[correctNextLetter]);
    } else {
      setCorrectNextLetter(particleSystemEnableWord.charAt(0));
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (particleSystemEnableWord.includes(event.key)) {
      handlePossiblyCorrectLetter(event.key);
    } else {
      setCorrectNextLetter(particleSystemEnableWord.charAt(0));
    }
  };
  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleSimulator, setParticleSimulator] = useState<ParticleSystemRenderer>();

  useEffect(() => {
    if (!particleSimulator) {
      return () => {
      };
    }

    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) {
      return () => {
      };
    }
    const context = canvas.getContext('2d');
    let animationFrameId: number;
    const render = () => {
      particleSimulator.doFrame();
      particleSimulator.renderFrame(context!, canvas);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  });

  useEffect(() => {
    if (!particleSystemEnabled) return;
    particleSimulator?.setTimeLeft(timeLeft);
  }, [timeLeft, particleSystemEnabled]);

  const [width, height] = useWindowSize();

  useEffect(() => {
    if (!particleSystemEnabled) return;

    canvasRef.current!.width = width;
    canvasRef.current!.height = height;
  }, [width, height, particleSystemEnabled]);

  useEffect(() => {
    if (!particleSystemEnabled) return () => {};
    const particleSystemRenderer = new ParticleSystemRenderer();
    particleSystemRenderer.initialize(canvasRef.current!);
    particleSystemRenderer.setTimeLeft(timeLeft);

    setParticleSimulator(particleSystemRenderer);
    return () => {
      particleSystemRenderer.destroy();
    };
  }, [particleSystemEnabled]);

  if (particleSystemEnabled) {
    return (
      <StyledCanvas
        ref={canvasRef}
        aria-label="particles"
        width={500}
        height={500}
      />
    );
  }
  return null;
};

export default ParticleSystem;
