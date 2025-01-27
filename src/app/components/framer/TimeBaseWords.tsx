"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ChangingWords = () => {
  const t =useTranslations("timeBaseWords")

  const words = [`${t("lostSth")}`, `${t("help")}`,`${t("foundSth")}` , `${t("helpOwner")}`]; // List of words
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWord(prevWord => {
        const currentIndex = words.indexOf(prevWord);
        const nextIndex = (currentIndex + 1) % words.length;
        return words[nextIndex];
      });
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  return (
    <motion.h1
      key={currentWord} // This ensures the animation is triggered each time the word changes
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: -20 }} // Moves the word up by 30px
      exit={{ opacity: 0, y: 0 }} // Returns to the original position
      transition={{ duration: 1, ease: 'easeInOut' }} // Animation duration
      className='text-xl'
    >
      {currentWord}
    </motion.h1>
  );
};

export default ChangingWords;
