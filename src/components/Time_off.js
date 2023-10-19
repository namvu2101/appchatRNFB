export const formatTime = time => {
  const newTime = new Date();
  const preTime = new Date(time);
  const timeDiff = Math.abs(newTime - preTime); // Kết quả sẽ là một số milliseconds
  const formattedTimeDiff = formatTimeDifference(timeDiff);
  return formattedTimeDiff;
};
const formatTimeDifference = time => {
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time / 1000) % 60);

  let formattedTime = '';
  if (days > 0) {
    formattedTime = `${days} ngày trước`;
  } else if (hours > 0) {
    formattedTime = `${hours} giờ trước`;
  } else if (minutes > 0 || seconds > 0) {
    formattedTime = `${minutes} phút trước`;
  }
  return formattedTime;
};
