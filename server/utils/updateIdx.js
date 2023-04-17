function updateIdx(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      return i;
    }
  }
  return -1;
}

export default updateIdx;
