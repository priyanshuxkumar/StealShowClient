function formatEventShowTime(showTime: Date) {
  const createdAt = new Date(showTime);

  let hours = createdAt.getUTCHours();
  const minutes = String(createdAt.getUTCMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

const formatEventDate = (isoDateString: Date) => {
  const date = new Date(isoDateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });

  return `${day} ${month}`; // 25 SEP
};

const formatDate = (isoDateString: Date) => {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // 2024-09-25
};

export { formatEventShowTime, formatEventDate, formatDate };
