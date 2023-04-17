function resetBoard() {
  const board = [
    {
      continent: "North America",
      countriesNum: 3,
      countries: new Array(3),
      idx: 0,
    },
    {
      continent: "Europe",
      countriesNum: 5,
      countries: new Array(5),
      idx: 0,
    },
    {
      continent: "Asia",
      countriesNum: 5,
      countries: new Array(5),
      idx: 0,
    },
    {
      continent: "South America",
      countriesNum: 4,
      countries: new Array(4),
      idx: 0,
    },
    {
      continent: "Africa",
      countriesNum: 5,
      countries: new Array(5),
      idx: 0,
    },
    {
      continent: "Oceania",
      countriesNum: 3,
      countries: new Array(3),
      idx: 0,
    },
  ];

  return board;
}

export default resetBoard;
