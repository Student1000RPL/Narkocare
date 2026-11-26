/* ==========================
   KUIS NARKOCARE
========================== */

const questions = [
    {
        q: "Apa salah satu dampak penyalahgunaan narkoba?",
        a: [
            "Meningkatkan kesehatan",
            "Menyebabkan ketergantungan",
            "Membuat tubuh selalu sehat"
        ],
        correct: 1
    },
    {
        q: "Apa yang sebaiknya dilakukan ketika diajak menggunakan narkoba?",
        a: [
            "Mencoba sekali",
            "Mengikuti teman",
            "Menolak dengan tegas"
        ],
        correct: 2
    },
    {
        q: "Apa kepanjangan BNN?",
        a: [
            "Badan Narkotika Nasional",
            "Badan Nasional Negara",
            "Badan Narkoba Nusantara"
        ],
        correct: 0
    },
    {
        q: "Mengapa kita harus mengetahui bahaya narkoba?",
        a: [
            "Agar bisa mencobanya",
            "Agar dapat menghindari penyalahgunaan",
            "Agar mengikuti teman"
        ],
        correct: 1
    },
    {
        q: "Apa salah satu cara mencegah penyalahgunaan narkoba?",
        a: [
            "Memilih pergaulan yang sehat",
            "Mencoba narkoba",
            "Menyembunyikan masalah"
        ],
        correct: 0
    },
    {
        q: "Siapa yang dapat dimintai bantuan?",
        a: [
            "Orang dewasa tepercaya",
            "Orang asing sembarangan",
            "Tidak perlu siapa pun"
        ],
        correct: 0
    },
    {
        q: "Apa dampak narkoba terhadap pendidikan?",
        a: [
            "Selalu meningkatkan prestasi",
            "Dapat mengganggu proses belajar",
            "Tidak memiliki dampak"
        ],
        correct: 1
    },
    {
        q: "Apa yang dimaksud dengan zat adiktif?",
        a: [
            "Zat yang dapat menyebabkan ketergantungan",
            "Zat yang selalu menyehatkan",
            "Makanan sehari-hari"
        ],
        correct: 0
    },
    {
        q: "Apa yang harus dilakukan jika teman mengalami masalah narkoba?",
        a: [
            "Mengucilkannya",
            "Mengejeknya",
            "Memberikan dukungan dan mengarahkan ke bantuan profesional"
        ],
        correct: 2
    },
    {
        q: "Apa tujuan utama edukasi anti narkoba?",
        a: [
            "Mengenalkan cara menggunakan narkoba",
            "Meningkatkan pengetahuan tentang bahaya dan pencegahan",
            "Mengajak orang mencoba narkoba"
        ],
        correct: 1
    }
];

const quizQuestions = document.getElementById("quizQuestions");
const resultButton = document.getElementById("resultButton");
const restartButton = document.getElementById("restartButton");
const quizResult = document.getElementById("quizResult");
const scoreText = document.getElementById("scoreText");
const tryAgainButton = document.getElementById("tryAgainButton");

function createQuiz() {
    quizQuestions.innerHTML = "";
    quizResult.classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");

    questions.forEach((question, index) => {
        const questionBox = document.createElement("div");
        questionBox.className = "quiz-question";

        const title = document.createElement("h3");
        title.textContent = `${index + 1}. ${question.q}`;
        questionBox.appendChild(title);

        question.a.forEach((answer, answerIndex) => {
            const label = document.createElement("label");
            label.className = "quiz-option";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = `question-${index}`;
            radio.value = answerIndex;

            const text = document.createElement("span");
            text.textContent = answer;

            label.appendChild(radio);
            label.appendChild(text);
            questionBox.appendChild(label);
        });

        quizQuestions.appendChild(questionBox);
    });
}

function showResult() {
    let score = 0;
    let unanswered = [];

    questions.forEach((question, index) => {
        const selected = document.querySelector(
            `input[name="question-${index}"]:checked`
        );

        if (!selected) {
            unanswered.push(index + 1);
            return;
        }

        if (Number(selected.value) === question.correct) {
            score++;
        }
    });

    if (unanswered.length > 0) {
        alert(
            "Jawab semua soal terlebih dahulu. " +
            "Soal belum dijawab: " + unanswered.join(", ")
        );
        return;
    }

    const finalScore = score * 10;

    document.getElementById("quizContainer").classList.add("hidden");
    quizResult.classList.remove("hidden");

    scoreText.textContent =
        `Kamu menjawab benar ${score} dari 10 soal. Nilai kamu: ${finalScore}/100.`;
}

resultButton.addEventListener("click", showResult);
restartButton.addEventListener("click", createQuiz);
tryAgainButton.addEventListener("click", createQuiz);

createQuiz();


/* ==========================
   FORM BANTUAN AI
========================== */

/* ==========================
   FORM BANTUAN AI
========================== */

const helpForm = document.getElementById("helpForm");
const sendButton = document.getElementById("sendButton");
const aiResponse = document.getElementById("aiResponse");
const aiAnswer = document.getElementById("aiAnswer");

helpForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const category =
        document.getElementById("category").value;

    const message =
        document.getElementById("message").value.trim();

    if (!message) {
        alert("Silakan tulis pesan terlebih dahulu.");
        return;
    }

    sendButton.disabled = true;
    sendButton.textContent = "Mengirim...";

    aiResponse.classList.remove("hidden");
    aiAnswer.textContent =
        "NARKOCARE AI sedang memproses pesan kamu...";

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: category,
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.reply || "Terjadi kesalahan.");
        }

        aiAnswer.textContent = data.reply;

    } catch (error) {
        console.error(error);

        aiAnswer.textContent =
            "Maaf, NARKOCARE AI belum dapat dihubungi. " +
            "Silakan coba kembali nanti.";

    } finally {
        sendButton.disabled = false;
        sendButton.textContent = "Kirim Pesan";
    }
});

/* ==========================
   NAVIGASI HALAMAN NARKOCARE
========================== */

const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

function showPage(pageId) {

    // Sembunyikan semua halaman
    pages.forEach(page => {
        page.classList.remove("active");
    });

    // Tampilkan halaman yang dipilih
    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    // Ubah warna menu aktif
    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.dataset.page === pageId) {
            link.classList.add("active");
        }
    });

    // Kembali ke posisi paling atas
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

    // Simpan halaman di alamat URL
    history.replaceState(null, "", "#" + pageId);
}

// Ketika menu navbar ditekan
navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const pageId = this.dataset.page;
        showPage(pageId);
    });
});

// Tombol Mulai Belajar dan Mulai Kuis
document.querySelectorAll(".hero-buttons a").forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();

        const pageId = this.getAttribute("href").replace("#", "");
        showPage(pageId);
    });
});

// Buka halaman sesuai URL jika ada
const initialPage = location.hash.replace("#", "");

if (document.getElementById(initialPage)?.classList.contains("page")) {
    showPage(initialPage);
} else {
    showPage("beranda");
}