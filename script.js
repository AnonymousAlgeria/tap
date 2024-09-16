document.addEventListener('DOMContentLoaded', function () {
  const avatar = document.getElementById('avatar');
  const counter = document.getElementById('counter');
  const congratulationsMessage = document.getElementById('congratulationsMessage');
  const clickSounds = [
    document.getElementById('clickSound1'),
    document.getElementById('clickSound2'),
    document.getElementById('clickSound3'),
    document.getElementById('clickSound4')
  ];
  const additionalSounds = [
    document.getElementById('clickSound5'),
    document.getElementById('clickSound6'),
    document.getElementById('clickSound7'),
    document.getElementById('clickSound8'),
    document.getElementById('clickSound9')
  ];
  const maxClicksBeforeSoundChange = 100; // عدد التكبيرات لكل تغيير في الصوت
  const numberOfSounds = additionalSounds.length; // عدد الأصوات الإضافية
  const maxClicksPerSecond = 5; // الحد الأقصى لعدد النقرات في الثانية

  let clickCount = parseInt(localStorage.getItem('clickCount')) || 0; // استعادة عدد النقرات من Local Storage
  let additionalSoundsPlayed = false; // للتأكد من تشغيل الأصوات الإضافية مرة واحدة فقط
  let lastClickTime = 0; // لتتبع وقت آخر نقرة
  let clickTimestamps = []; // لتتبع توقيتات النقرات الأخيرة

  // تحديث العداد بناءً على العدد المستعاد
  counter.textContent = clickCount;

  // دالة لتشغيل صوت النقر المناسب
  function playClickSound() {
    const randomIndex = Math.floor(Math.random() * clickSounds.length);
    clickSounds[randomIndex].currentTime = 0;
    clickSounds[randomIndex].play();
  }

  // دالة لتشغيل صوت الخلفية (لكن لا يوجد صوت خلفي حاليا)
  function toggleBackgroundMusic() {
    // لا يوجد صوت خلفي
  }

  // إضافة استماع لنقرات الفأرة
  avatar.addEventListener('click', () => {
    const currentTime = new Date().getTime();
    clickTimestamps = clickTimestamps.filter(timestamp => currentTime - timestamp < 1000); // احتفظ فقط بالنقرات التي تمت في آخر ثانية
    if (clickTimestamps.length >= maxClicksPerSecond) { // إذا تجاوز عدد النقرات في الثانية الحد الأقصى
      console.warn('Clicking too fast!');
      return;
    }
    clickTimestamps.push(currentTime);

    clickCount++;
    counter.textContent = clickCount;

    // تخزين عدد النقرات في Local Storage
    localStorage.setItem('clickCount', clickCount);

    // تشغيل صوت النقر
    playClickSound();

    // تأثيرات بسيطة على الصورة بعد النقر
    avatar.style.transform = 'scale(1.1)'; // تكبير الصورة بشكل بسيط
    setTimeout(() => {
      avatar.style.transform = 'scale(1)';
    }, 200); // العودة إلى الحجم الأصلي بعد 200 ميلي ثانية

    // التحقق من عدد النقرات لتغيير صوت النقر كل 100 نقرة وفقط عندما لم يتم تشغيل الأصوات الإضافية بعد
    if (clickCount % maxClicksBeforeSoundChange === 0 && !additionalSoundsPlayed) {
      const randomIndex = Math.floor(Math.random() * numberOfSounds);
      additionalSounds[randomIndex].currentTime = 0;
      additionalSounds[randomIndex].play();
      additionalSoundsPlayed = true; // تعيين القيمة لتشغيل الأصوات الإضافية مرة واحدة فقط
    }

    // إعادة تهيئة المتغير additionalSoundsPlayed بعد كل 100 نقرة
    if (clickCount % maxClicksBeforeSoundChange === 0) {
      additionalSoundsPlayed = false;
    }

    // عرض رسالة التهنئة عند وصول العداد إلى كل 100 نقرة
    if (clickCount % maxClicksBeforeSoundChange === 0) {
      congratulationsMessage.style.display = 'block';
      counter.style.transform = 'scale(1.1)'; // تكبير عداد النقرات

      // تحديث نص رسالة التهنئة بناءً على عدد النقرات
      const milestone = clickCount / maxClicksBeforeSoundChange;
      congratulationsMessage.querySelector('p').textContent = `لقد وصلت إلى ${milestone * 100} تكبيسة!`;

      // إخفاء رسالة التهنئة بعد 3 ثواني
      setTimeout(() => {
        congratulationsMessage.style.display = 'none';
        counter.style.transform = 'scale(1)'; // العودة إلى حجم العداد الأصلي
      }, 3000);
    }
  });

  // إضافة استماع لزر التحكم في الموسيقى الخلفية
  toggleMusicButton.addEventListener('click', toggleBackgroundMusic);
});
