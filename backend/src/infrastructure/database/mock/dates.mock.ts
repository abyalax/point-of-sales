type Params = {
  year?: number;
  months?: number[];
  maxPerWeek?: number;
};

const defaultMonth = Array.from({ length: 12 }, (_, i) => i + 1);
const defaultYear = new Date().getFullYear() - 1;

export function generateDates({ year = defaultYear, months = defaultMonth, maxPerWeek = 3 }: Params): Date[] {
  const dates: Date[] = [];
  for (const month of months) {
    const daysInMonth = new Date(year, month, 0).getDate();
    let day = 1;

    while (day <= daysInMonth) {
      const weekDays: number[] = [];
      for (let i = 0; i < 7 && day <= daysInMonth; i++) {
        weekDays.push(day);
        day++;
      }

      const countThisWeek = maxPerWeek === 1 ? 1 : Math.floor(Math.random() * (maxPerWeek - 1 + 1)) + 1;

      for (let i = 0; i < countThisWeek; i++) {
        const chosenDay = weekDays[Math.floor(Math.random() * weekDays.length)];

        // jam random 08:00 - 21:00
        const hour = Math.floor(Math.random() * (21 - 8 + 1)) + 8;
        const minute = Math.floor(Math.random() * 60);
        const second = Math.floor(Math.random() * 60);
        const ms = Math.floor(Math.random() * 1000);

        dates.push(new Date(year, month - 1, chosenDay, hour, minute, second, ms));
      }
    }
  }

  dates.sort((a, b) => a.getTime() - b.getTime());
  return dates;
}
