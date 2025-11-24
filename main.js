document.addEventListener('DOMContentLoaded', () => {
  const meetingForm = document.querySelector('#meeting-form');

  if (!meetingForm) return;

  meetingForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(meetingForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const date = formData.get('date');
    const time = formData.get('time');
    const topic = formData.get('topic').trim();
    const feedback = meetingForm.querySelector('.meeting-feedback');

    if (!date || !time) {
      feedback.textContent = 'Please select date and time.';
      return;
    }

    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const formatICSDate = value => {
      return value
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0] + 'Z';
    };

    const pad = value => String(value).padStart(2, '0');
    const humanDate = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
    const humanTime = `${pad(start.getHours())}:${pad(start.getMinutes())}`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Prince Raj//Meeting//EN
BEGIN:VEVENT
UID:${Date.now()}@prince.meeting
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
SUMMARY:Meeting with Prince Raj
DESCRIPTION:${topic}
LOCATION:Online
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `meeting-${humanDate}-${humanTime}.ics`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(url), 0);

    const subject = encodeURIComponent(`Meeting booking from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nDate: ${humanDate}\nTime: ${humanTime}\nTopic: ${topic}`
    );

    window.location.href = `mailto:rajprince3841@gmail.com?subject=${subject}&body=${body}`;

    feedback.textContent = 'Opening your email app and delivering a calendar invite...';
    meetingForm.reset();
  });
});

