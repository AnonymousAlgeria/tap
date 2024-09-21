// إعدادات API الخاصة بتليجرام
const botToken = '7072757477:AAE2AiJ3zsoEbLaBWq3rvOat1Ef7tUHNhsg'; // التوكن الخاص بالبوت
const groupUsernames = ['@you_off01_comment', '@Minds_Tech_chat', '@VU_NY']; // أسماء المستخدمين الخاصة بكل مجموعة

// التعامل مع نموذج التعبير عن المشاعر
document.getElementById('express-form').addEventListener('submit', function(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    // الحصول على اسم المستخدم ورسالة المستخدم
    const username = document.getElementById('username').value;
    const userMessage = document.getElementById('feelings').value;

    // صياغة الرسالة بالشكل المطلوب
    const messageWithUsername = `'${username}'\n\nيقول 💬: ${userMessage}`;

    // إرسال الرسالة إلى جميع المجموعات
    groupUsernames.forEach(function(groupUsername) {
        sendMessageToTelegram(messageWithUsername, groupUsername);
    });
});


// إرسال الرسالة إلى مجموعة على تليجرام
function sendMessageToTelegram(message, username) {
    if (message.trim() === '') return;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = {
        chat_id: username,
        text: message
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            document.getElementById('response-message').textContent = 'تم إرسال الرسالة إلى المجموعة بنجاح.';
        } else {
            document.getElementById('response-message').textContent = 'حدث خطأ أثناء الإرسال إلى إحدى المجموعات.';
        }
    })
    .catch(error => {
        document.getElementById('response-message').textContent = 'فشل في الاتصال. تأكد من اتصالك بالإنترنت.';
    });
}

// نموذج إرسال الصور أو الأصوات
document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    // التحقق من وجود ملف
    if (!file) {
        document.getElementById('upload-message').textContent = 'الرجاء اختيار ملف قبل الإرسال.';
        return;
    }

    // إرسال الملف إلى جميع المجموعات
    groupUsernames.forEach(function(username) {
        sendFileToTelegram(file, username);
    });
});

// إرسال الملف إلى مجموعة على تليجرام
function sendFileToTelegram(file, username) {
    const url = file.type.startsWith('image/') 
        ? `https://api.telegram.org/bot${botToken}/sendPhoto`
        : (file.type.startsWith('audio/') 
            ? `https://api.telegram.org/bot${botToken}/sendAudio`
            : `https://api.telegram.org/bot${botToken}/sendDocument`);

    const formData = new FormData();
    formData.append('chat_id', username);
    formData.append(file.type.startsWith('image/') ? 'photo' : (file.type.startsWith('audio/') ? 'audio' : 'document'), file);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            document.getElementById('upload-message').textContent = 'تم إرسال الملف بنجاح.';
        } else {
            document.getElementById('upload-message').textContent = 'حدث خطأ أثناء إرسال الملف.';
        }
    })
    .catch(error => {
        document.getElementById('upload-message').textContent = 'فشل في الاتصال. تأكد من اتصالك بالإنترنت.';
    });
}
