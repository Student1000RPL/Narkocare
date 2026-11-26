const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
    try {
        const { category, message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                reply: "Silakan tulis pesan terlebih dahulu."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                reply: "Konfigurasi AI belum tersedia."
            });
        }

        const prompt = `
Kamu adalah NARKOCARE AI, asisten edukasi
pencegahan narkoba untuk remaja.

Tugasmu:
- Menjawab pertanyaan tentang narkoba.
- Memberikan edukasi dan informasi pencegahan.
- Menggunakan bahasa Indonesia yang sederhana.
- Bersikap ramah, sopan, dan tidak menghakimi.
- Memberikan jawaban yang jelas dan tidak terlalu panjang.
- Tidak memberikan petunjuk memperoleh atau menggunakan narkoba.
- Jika seseorang membutuhkan bantuan, arahkan kepada
  orang tua, guru, konselor, atau tenaga kesehatan tepercaya.
- Jelaskan bahwa kamu adalah AI, bukan tenaga profesional.

Kategori pesan: ${category || "Umum"}
Pesan pengguna: ${message}
`;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini error:", data);

            return res.status(500).json({
                reply: "Maaf, NARKOCARE AI sedang mengalami gangguan."
            });
        }

        const reply =
            data.candidates?.[0]?.content?.parts
                ?.map(part => part.text || "")
                .join("\n");

        res.json({
            reply: reply || "Maaf, AI belum dapat memberikan jawaban."
        });

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            reply: "Terjadi kesalahan. Silakan coba kembali."
        });
    }
});

app.listen(3000, () => {
    console.log("NARKOCARE berjalan di http://localhost:3000");
});