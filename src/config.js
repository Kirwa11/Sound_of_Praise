export const EVENT_INFO = {
  title: 'New Biginning Concert',
  date: 'Sunday 28th September 2025',
  time: '2:00 pm - 5:00 pm',
  venue: 'UON Main Campus',
  contactPhone: '+254111872056',
  contactEmail: 'Re.fous@gmail.com',
};

export function buildNotificationBody() {
  const { date, time, venue, contactPhone, contactEmail } = EVENT_INFO;
  return `Thank you for coming.\nDate: ${date}\nTime: ${time}\nVenue: ${venue}\nHave a good time as you plan to come.\nFor confirmation or questions, call ${contactPhone} or email ${contactEmail}`;
}
