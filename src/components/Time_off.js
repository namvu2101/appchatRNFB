export const formatTime = time => {
  if (typeof time === 'object' && time.seconds && time.nanoseconds) {
    const milliseconds = time.seconds * 1000 + time.nanoseconds / 1000000;
    const newTime = new Date();
    const preTime = new Date(milliseconds);
    const timeDiff = Math.abs(newTime - preTime);
    const formattedTimeDiff = formatTimeDifference(timeDiff);
    return formattedTimeDiff;
  } else {
    return 'Thời gian không hợp lệ';
  }
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
  } else if (minutes > 0) {
    formattedTime = `${minutes} phút trước`;
  } else if (seconds > 0) {
    formattedTime = '1 phút trước';
  }
  return formattedTime;
};
