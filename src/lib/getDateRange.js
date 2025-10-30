export default function getDateRange(range) {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case "yesterday":
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;

    case "7d":
      start.setDate(now.getDate() - 7);
      break;

    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;

    case "3m":
      start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      break;

    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      break;

    default:
      start.setDate(now.getDate() - 7);
  }

  return { start, end };
}
