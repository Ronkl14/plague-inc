import { useEffect, useState } from "react";

const useFetchCards = (cardIndices, fetchCardFn) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function fetchCards() {
      try {
        const newCards = await Promise.all(
          cardIndices.map(async (index) => await fetchCardFn(index))
        );
        setCards(newCards);
      } catch (err) {}
    }
    fetchCards();
  }, [cardIndices, fetchCardFn]);

  return cards;
};

export default useFetchCards;
