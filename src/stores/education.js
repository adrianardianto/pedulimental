import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useEducationStore = defineStore('education', () => {
    const authStore = useAuthStore();
    
    // State (data history)
    const allHistory = ref(JSON.parse(localStorage.getItem('pedulimental_article_history') || '[]'));

    // Filter history user saat ini
    const history = computed(() => {
        if (!authStore.user?.email) return [];
        return allHistory.value.filter(item => item.userEmail === authStore.user.email);
    });

    // Data konten
    const contents = [
      {
        id: 1,
        type: 'Artikel',
        category: 'Stress',
        duration: '5 menit',
        title: 'Mengelola Stres di Tempat Kerja',
        description: 'Stres kerja adalah hal yang umum dialami. Pelajari strategi efektif untuk mengelola stres',
        author: 'Dr. Sarah Wijaya',
        date: '10 Des 2024',
        bgClass: 'bg-blue',
        image: 'https://cdn.pixabay.com/photo/2019/05/13/22/15/frustrated-4201046_640.jpg',
        contentUrl: 'https://www.halodoc.com/artikel/cara-mengatasi-stres-kerja-yang-efektif',
        fullContent: `
          <p class="intro-text">Stres di tempat kerja bukan lagi isu sepele. Organisasi Kesehatan Dunia (WHO) bahkan telah mengklasifikasikan <em>burnout</em> sebagai fenomena okupasional yang diakibatkan oleh stres kronis di tempat kerja yang tidak tertangani dengan baik. Artikel ini akan membahas secara mendalam bagaimana mengenali, mencegah, dan mengatasi stres kerja sebelum berdampak fatal pada kesehatan Anda.</p>
          
          <h2>Dampak Biologis Stres Kronis</h2>
          <p>Ketika Anda mengalami stres terus-menerus, tubuh Anda berada dalam kondisi <em>fight-or-flight</em> yang permanen. Kelenjar adrenal memompa kortisol dan adrenalin berlebih. Dalam jangka panjang, ini dapat menyebabkan:</p>
          <ul>
            <li><strong>Penurunkan Sistem Imun:</strong> Anda menjadi lebih mudah terserang flu atau infeksi lainnya.</li>
            <li><strong>Masalah Kardiovaskular:</strong> Peningkatan tekanan darah dan risiko penyakit jantung.</li>
            <li><strong>Gangguan Tidur:</strong> Insomnia atau kualitas tidur yang buruk, yang kemudian memperparah stres itu sendiri.</li>
            <li><strong>Gangguan Pencernaan:</strong> Seperti maag, GERD, atau sindrom iritasi usus besar (IBS).</li>
          </ul>

          <h2>Mengenali Tanda-tanda Peringatan (Red Flags)</h2>
          <p>Seringkali kita mengabaikan sinyal tubuh sampai semuanya terlambat. Perhatikan tanda-tanda berikut:</p>
          <ul>
             <li><strong>Emosional:</strong> Mudah marah, sinisme terhadap rekan kerja, perasaan tidak berdaya, atau hilangnya motivasi.</li>
             <li><strong>Kognitif:</strong> Sulit berkonsentrasi, sering lupa, dan kesulitan mengambil keputusan sederhana.</li>
             <li><strong>Perilaku:</strong> Menunda-nunda pekerjaan (prokrastinasi), isolasi diri dari tim, atau konsumsi kafein/gula berlebih.</li>
          </ul>

          <h2>Strategi Komprehensif Mengelola Stres</h2>
          
          <h3>1. Manajemen Batasan (Boundary Management)</h3>
          <p>Di era digital, garis antara pekerjaan dan kehidupan pribadi semakin kabur. Anda perlu tegas:</p>
          <ul>
             <li>Matikan notifikasi email kerja setelah jam tertentu.</li>
             <li>Belajarlah berkata "Tidak" atau "Bisa bantu prioritas ulang tugas saya?" saat atasan memberikan beban kerja berlebih.</li>
             <li>Jangan makan siang di meja kerja Anda. Gunakan waktu itu untuk benar-benar istirahat.</li>
          </ul>

          <h3>2. Teknik Grounding di Meja Kerja</h3>
          <p>Saat Anda merasa kewalahan, cobalah teknik pernapasan kotak (Box Breathing):</p>
          <ul>
             <li>Tarik napas 4 detik.</li>
             <li>Tahan 4 detik.</li>
             <li>Hembuskan 4 detik.</li>
             <li>Tahan kosong 4 detik.</li>
          </ul>
          <p>Lakukan ini selama 2 menit untuk menenangkan sistem saraf Anda.</p>

          <h3>3. Ergonomi dan Lingkungan Fisik</h3>
          <p>Stres fisik memperparah stres mental. Pastikan kursi Anda mendukung punggung, layar monitor sejajar mata, dan pencahayaan cukup. Tanaman kecil di meja kerja juga terbukti dapat menurunkan tingkat stres visual.</p>

          <h2>Membangun Sistem Pendukung</h2>
          <p>Jangan menderita dalam diam. Bicaralah dengan rekan kerja yang Anda percaya. Seringkali, sekadar didengarkan (validasi emosi) sudah cukup mengurangi beban psikologis. Jika masalah berlanjut, hubungi divisi HRD atau manfaatkan program bantuan karyawan (EAP) jika tersedia.</p>
        `
      },
      {
        id: 2,
        type: 'Video',
        category: 'Self-Care',
        duration: '12 menit',
        title: 'Pentingnya Self-Care untuk Kesehatan Mental',
        description: 'Self-care bukan tentang mementingkan diri sendiri, tetapi tentang merawat diri agar dapat',
        author: 'Psikolog Amanda Chen',
        date: '8 Des 2024',
        bgClass: 'bg-teal',
        image: 'https://cdn.pixabay.com/photo/2020/06/10/07/05/yoga-5281457_640.jpg',
        contentUrl: 'https://www.youtube.com/watch?v=w0iVVd0S30I',
        videoUrl: 'https://www.youtube.com/embed/hJbRpHZr_d0', // Combined from different views
        fullContent: `
           <p class="intro-text">Seringkali kita merasa bersalah ketika meluangkan waktu untuk diri sendiri. Kita menganggapnya sebagai kemewahan atau tindakan egois. Padahal, self-care adalah kebutuhan biologis dan psikologis dasar. Video ini akan mengubah paradigma Anda tentang merawat diri.</p>
           
           <h2>Apa itu Self-Care Sebenarnya?</h2>
           <p>Self-care bukan hanya tentang spa atau liburan mahal. Self-care adalah tindakan sadar dan disengaja untuk menjaga kesehatan fisik, mental, dan emosional kita. Ini adalah tentang:</p>
           <ul>
             <li>Mengetahui batasan diri sendiri.</li>
             <li>Memberikan nutrisi yang tepat bagi tubuh dan pikiran.</li>
             <li>Membangun hubungan yang sehat dengan diri sendiri.</li>
           </ul>
           
           <h2>Mengapa Kita Sering Mengabaikannya?</h2>
           <p>Banyak dari kita terjebak dalam budaya "hustle" yang memuliakan kesibukan. Kita merasa produktif hanya jika kita kelelahan. Ini adalah pola pikir yang berbahaya yang menuju pada <em>burnout</em>.</p>

           <h2>Pilar-pilar Self-Care Sederhana</h2>
           
           <h3>1. Self-Care Fisik</h3>
           <p>Ini mencakup tidur 7-8 jam, minum air yang cukup, dan menggerakkan tubuh. Bukan olahraga berat, tapi sekadar jalan pagi 15 menit sudah cukup untuk melepaskan endorfin.</p>

           <h3>2. Self-Care Emosional</h3>
           <p>Izinkan diri Anda merasakan emosi tanpa menghakiminya. Menangis jika sedih, marah jika kecewa. Menulis jurnal emosi adalah cara yang sangat baik untuk memproses perasaan ini.</p>

           <h3>3. Self-Care Sosial</h3>
           <p>Ini bisa berarti menghabiskan waktu dengan orang yang memberi energi positif, TAPI juga bisa berarti menolak ajakan keluar saat Anda butuh waktu sendiri (solitude).</p>

           <h2>Tanda Anda Mengalami Defisit Self-Care</h2>
           <ul>
             <li>Mudah tersinggung oleh hal kecil.</li>
             <li>Sering sakit kepala atau gangguan fisik ringan.</li>
             <li>Merasa hampa atau mati rasa (numb).</li>
             <li>Kehilangan minat pada hobi.</li>
           </ul>
           
           <h2>Kesimpulan</h2>
           <p>Anda tidak bisa menuang dari gelas yang kosong. Merawat diri sendiri adalah langkah pertama untuk bisa merawat orang lain (keluarga, pekerjaan, komunitas). Mulailah hari ini dengan satu tindakan kecil: mungkin tidur 15 menit lebih awal malam ini.</p>
        `
      },
      {
        id: 3,
        type: 'Artikel',
        category: 'Mindfulness',
        duration: '7 menit',
        title: 'Teknik Mindfulness untuk Pemula',
        description: 'Mindfulness adalah praktik sederhana yang dapat membantu mengurangi kecemasan dan',
        author: 'Dr. Budi Santoso',
        date: '5 Des 2024',
        bgClass: 'bg-blue',
        image: 'https://cdn.pixabay.com/photo/2017/03/26/21/54/yoga-2176668_640.jpg',
        fullContent: `
           <p class="intro-text">Mindfulness atau kesadaran penuh bukan sekadar tren kesehatan modern. Ini adalah praktik kuno yang telah terbukti secara neurosains dapat mengubah struktur otak kita, meningkatkan kebahagiaan, dan mengurangi reaktivitas emosional.</p>
           
           <h2>Sains di Balik Mindfulness</h2>
           <p>Penelitian menggunakan MRI menunjukkan bahwa praktik mindfulness rutin dapat:</p>
           <ul>
             <li>Mengecilkan ukuran <strong>Amygdala</strong>: Bagian otak yang bertanggung jawab atas respons rasa takut dan stres ("fight or flight").</li>
             <li>Menebalkan <strong>Prefrontal Cortex</strong>: Area yang mengatur fokus, perencanaan, dan pengambilan keputusan rasional.</li>
           </ul>
           <p>Artinya, dengan mindfulness, Anda secara harfiah melatih otak untuk menjadi lebih tenang dan bijaksana.</p>

           <h2>3 Latihan Sederhana untuk Memulai (Tanpa Matras Yoga!)</h2>
           <p>Banyak orang berpikir meditasi harus duduk bersila selama satu jam. Itu salah. Mindfulness bisa dilakukan di sela-sela aktivitas.</p>

           <h3>1. Teknik Pernapasan 4-7-8 (Untuk Menenangkan Diri)</h3>
           <p>Sangat efektif dilakukan saat Anda merasa cemas atau sulit tidur.</p>
           <ul>
             <li>Buang napas sepenuhnya melalui mulut (suara "whoosh").</li>
             <li>Tutup mulut, tarik napas via hidung hitungan <strong>4</strong>.</li>
             <li>Tahan napas hitungan <strong>7</strong>.</li>
             <li>Hembuskan via mulut perlahan hitungan <strong>8</strong>.</li>
             <li>Ulangi siklus ini 4 kali.</li>
           </ul>

           <h3>2. Mindful Eating (Makan dengan Sadar)</h3>
           <p>Saat makan siang berikutnya, cobalah makan tanpa HP/laptop. Perhatikan tekstur makanan, warnanya, aromanya, dan rasanya. Kunyah perlahan. Ini tidak hanya baik untuk pikiran, tapi juga pencernaan.</p>

           <h3>3. The 5 Senses Check-in (Cek 5 Indera)</h3>
           <p>Lakukan ini saat berjalan ke parkiran atau halte:</p>
           <ul>
             <li>Apa 5 benda yang saya lihat?</li>
             <li>Apa 4 suara yang saya dengar?</li>
             <li>Apa 3 hal yang kulit saya rasakan (angin, kain baju)?</li>
             <li>Apa 2 aroma yang tercium?</li>
             <li>Apa 1 rasa di lidah saya?</li>
           </ul>
    
           <h2>Tantangan Umum Pemula</h2>
           <p><em>"Pikiran saya tidak bisa diam!"</em></p>
           <p>Ini normal. Tujuan mindfulness bukan menghentikan pikiran, tapi <strong>menyadarinya</strong>. Saat Anda sadar "Oh, saya sedang memikirkan tagihan listrik", lalu perlahan kembali ke napas, itulah "reps" atau latihan mentalnya. Setiap kali Anda kembali, otot fokus Anda semakin kuat.</p>
        `
      },
      {
        id: 4,
        type: 'Artikel',
        category: 'Anxiety',
        duration: '8 menit',
        title: 'Memahami dan Mengatasi Anxiety',
        description: 'Anxiety adalah respons alami tubuh terhadap stres. Pelajari cara mengenali gejala dan teknik',
        author: 'Dr. Sarah Wijaya',
        date: '3 Des 2024',
        bgClass: 'bg-teal',
        image: 'https://cdn.pixabay.com/photo/2017/08/21/19/00/woman-2666433_640.jpg',
        fullContent: `
          <p class="intro-text">Kecemasan (anxiety) sering disalahartikan sebagai sekadar rasa "khawatir". Padahal bagi jutaan orang, ini adalah pertempuran konstan melawan pikran irasional dan gejala fisik yang melemahkan. Memahami mekanismenya adalah langkah pertama untuk mengendalikannya.</p>
          
          <h2>Anatomi Kecemasan: Apa yang Terjadi di Tubuh?</h2>
          <p>Saat cemas, sistem saraf simpatik Anda membajak tubuh. Ini adalah sistem purba yang dirancang untuk menyelamatkan kita dari singa, tapi di dunia modern, ia aktif karena email atasan atau tagihan menumpuk.</p>
          <ul>
            <li><strong>Jantung Berdebar:</strong> Memompa darah ke otot untuk "lari".</li>
            <li><strong>Napas Pendek:</strong> Mengambil lebih banyak oksigen.</li>
            <li><strong>Pencernaan Terhenti:</strong> Energi dialihkan dari perut (menyebabkan mual saat gugup).</li>
            <li><strong>Keringat Dingin:</strong> Untuk mendinginkan tubuh saat "bertempur".</li>
          </ul>

          <h2>Membedakan Cemas Normal vs Gangguan Kecemasan (GAD)</h2>
          <p>Cemas sebelum kencan pertama itu normal. Namun waspadai Generalized Anxiety Disorder (GAD) jika:</p>
          <ul>
            <li>Kecemasan tidak proporsional dengan pemicunya.</li>
            <li>Berlangsung hampir setiap hari selama minimal 6 bulan.</li>
            <li>Disertai gejala fisik (ketegangan otot, mudah lelah).</li>
            <li>Menyebabkan perilaku menghindar (tidak mau keluar rumah, tidak mau angkat telpon).</li>
          </ul>
          
          <h2>Teknik Coping Teruji Klinis</h2>
          
          <h3>1. Teknik Grounding 5-4-3-2-1</h3>
          <p>Metode ini memaksa otak prefrontal (rasional) mengambil alih kendali dari amigdala (emosional) dengan berfokus pada sensasi fisik nyata saat ini.</p>

          <h3>2. "Worry Time" (Jadwal Khawatir)</h3>
          <p>Seringkali kecemasan mengganggu sepanjang hari. Cobalah teknik ini: Izinkan diri Anda khawatir HANYA pada jam 16:00 - 16:20. Jika pikiran cemas muncul jam 10 pagi, catat dan katakan "Saya akan memikirkan ini nanti jam 4 sore". Seringkali saat jam 4 tiba, kecemasan itu sudah hilang urgensinya.</p>

          <h3>3. Kurangi Stimulan Biologis</h3>
          <ul>
            <li><strong>Kafein:</strong> Mimik gejala panik (jantung berdebar). Kurangi kopi/teh.</li>
            <li><strong>Gula Darah:</strong> Hipoglikemia (gula darah rendah) bisa memicu rasa cemas. Makan teratur.</li>
            <li><strong>Kurang Tidur:</strong> Otak yang lelah lebih reaktif terhadap ancaman.</li>
          </ul>

          <h2>Kapan Harus ke Profesional?</h2>
          <p>Jika kecemasan Anda mencegah Anda melakukan hal-hal yang Anda sukai, atau jika Anda mulai menggunakan alkohol/obat-obatan untuk menenangkan diri, segera cari bantuan profesional. Terapi CBT (Cognitive Behavioral Therapy) sangat efektif untuk mengobati gangguan kecemasan tanpa obat-obatan.</p>
        `
      },
      {
        id: 5,
        type: 'Video',
        category: 'Relationships',
        duration: '15 menit',
        title: 'Membangun Komunikasi Sehat dalam Hubungan',
        description: 'Komunikasi yang baik adalah kunci hubungan yang sehat. Temukan tips praktis untuk',
        author: 'Psikolog Amanda Chen',
        date: '1 Des 2024',
        bgClass: 'bg-blue',
        image: 'https://cdn.pixabay.com/photo/2015/05/24/17/16/meeting-782050_1280.jpg',
        contentUrl: 'https://www.youtube.com/watch?v=X5uR071a_yI',
        videoUrl: 'https://www.youtube.com/embed/R1vskiVDwl4',
        fullContent: `
          <p class="intro-text">Sering merasa disalahpahami oleh pasangan? Atau diskusi kecil selalu berujung pertengkaran hebat? Masalahnya seringkali bukan pada <em>apa</em> yang kita bicarakan, tapi <em>bagaimana</em> kita menyampaikannya. Komunikasi asertif adalah kunci hubungan langgeng.</p>
          
          <h2>4 Pembunuh Komunikasi (The Four Horsemen)</h2>
          <p>Menurut Dr. John Gottman, peneliti hubungan terkenal, ada 4 pola yang memprediksi perceraian dengan akurasi 90%:</p>
          <ol>
            <li><strong>Kritik:</strong> Menyerang karakter pasangan ("Kamu pemalas") alih-alih perilaku ("Kamu lupa buang sampah").</li>
            <li><strong>Penghinaan:</strong> Mengejek, sarkasme, memutar bola mata. Ini adalah racun terbesar hubungan.</li>
            <li><strong>Defensif:</strong> Selalu membela diri dan menyalahkan balik saat dikritik.</li>
            <li><strong>Stonewalling:</strong> Menarik diri, mendiamkan (silent treatment), atau pergi saat konflik memanas.</li>
          </ol>
          
          <h2>Antidot: Teknik Komunikasi Sehat</h2>

          <h3>1. Gunakan "I Statements" (Pernyataan Saya)</h3>
          <p>Hindari kata "Kamu selalu..." atau "Kamu tidak pernah...". Gantilah dengan:</p>
          <p><em>"Saya merasa [emosi] ketika [situasi], karena saya butuh [kebutuhan]."</em></p>
          <p>Contoh: "Saya merasa lelah ketika cucian piring menumpuk, karena saya butuh bantuan menjaga kebersihan rumah."</p>

          <h3>2. Validasi Emosi</h3>
          <p>Anda tidak harus setuju dengan pendapat pasangan untuk memvalidasi perasaannya. Cukup katakan: "Saya mengerti kenapa kamu marah soal itu, itu masuk akal." Ini menurunkan tensi seketika.</p>

          <h3>3. Aturan "Time Out"</h3>
          <p>Jika detak jantung naik di atas 100bpm saat bertengkar, kemampuan rasional otak mati. Sepakati kode untuk istirahat 20 menit saat pertengkaran memanas. Kembalilah berdiskusi saat sudah tenang.</p>
          
          <h2>Mendengarkan untuk Memahami, Bukan Menjawab</h2>
          <p>Banyak dari kita mendengarkan hanya untuk menyiapkan balasan. Cobalah teknik "Reflective Listening": Ulangi apa yang pasangan katakan dengan bahasa Anda sendiri sebelum Anda merespons ("Jadi menurutmu aku kurang perhatian ya akhir-akhir ini?"). Ini memastikan tidak ada kesalahpahaman.</p>
        `
      },
      {
        id: 6,
        type: 'Artikel',
        category: 'Depression',
        duration: '6 menit',
        title: 'Mengenali Tanda-tanda Depresi',
        description: 'Depresi lebih dari sekadar rasa sedih. Kenali gejala-gejala depresi dan kapan waktu yang',
        author: 'Dr. Budi Santoso',
        date: '28 Nov 2024',
        bgClass: 'bg-teal',
        image: 'https://cdn.pixabay.com/photo/2018/05/22/14/00/girl-3421489_640.jpg',
        fullContent: `
          <p class="intro-text">Depresi adalah "The Common Cold of Psychiatry", gangguan mental yang paling umum namun paling sering disalahpahami. Ini bukan tanda kelemahan karakter, kurang iman, atau sekadar "baper". Depresi adalah kondisi medis yang melibatkan ketidakseimbangan kimiawi di otak.</p>
          
          <h2>Spektrum Gejala Depresi</h2>
          <p>Untuk didiagnosis depresi mayor, gejala harus berlangsung minimal 2 minggu dan mengganggu fungsi hidup. Gejala dibagi menjadi:</p>
          
          <h3>1. Gejala Emosional</h3>
          <ul>
             <li>Rasa sedih yang dalam dan persisten (pada pria sering bermanifestasi sebagai kemarahan/iritabilitas).</li>
             <li><strong>Anhedonia:</strong> Hilangnya kemampuan merasakan kebahagiaan dari aktivitas yang dulu disukai (hobi, seks, makanan).</li>
             <li>Perasaan bersalah berlebihan atau merasa tidak berharga.</li>
          </ul>

          <h3>2. Gejala Fisik (Sering Terabaikan)</h3>
          <ul>
             <li>Kelelahan ekstrem (fatigue) meski sudah tidur cukup.</li>
             <li>Nyeri fisik yang tidak menjelas (sakit punggung, sakit kepala).</li>
             <li>Perubahan berat badan drastis (>5% dalam sebulan).</li>
             <li>Gangguan tidur: Insomnia atau tidur terus-menerus (hipersomnia).</li>
          </ul>

          <h3>3. Gejala Kognitif</h3>
          <ul>
             <li>"Brain fog": Sulit fokus atau mengingat detail.</li>
             <li>Keragu-raguan ekstrem dalam mengambil keputusan.</li>
             <li>Pikiran berulang tentang kematian atau bunuh diri.</li>
          </ul>
          
          <h2>Mematahkan Mitos Depresi</h2>
          <p><strong>Mitos:</strong> "Depresi butuh alasan sedih yang jelas."<br>
          <strong>Fakta:</strong> Depresi bisa bersifat endogen (faktor biologis/genetik) dan muncul saat hidup Anda tampak "baik-baik saja". Inilah yang membuat penderitanya bingung dan merasa bersalah.</p>

          <p><strong>Mitos:</strong> "Kalau minum obat, nanti ketergantungan."<br>
          <strong>Fakta:</strong> Antidepresan tidak adiktif. Mereka menyeimbangkan neurotransmitter agar terapi psikologis bisa bekerja lebih efektif.</p>

          <h2>Langkah Kecil Pemulihan (Behavioral Activation)</h2>
          <p>Depresi membuat Anda ingin diam di tempat tidur, tapi diam justru memperparah depresi. Lawanlah dengan "Behavioral Activation":</p>
          <ul>
             <li>Lakukan aktivitas kecil meski TIDAK ADA motivasi. Motivasi muncul SETELAH aksi, bukan sebelumnya.</li>
             <li>Mandi pagi, berjemur 5 menit, atau menyiram tanaman.</li>
             <li>Rayakan kemenangan-kemenangan kecil ini.</li>
          </ul>

          <h2>Kapan Harus Mencari Pertolongan Darurat?</h2>
          <p>Jika Anda atau orang terdekat memiliki rencana spesifik untuk mengakhiri hidup, ini adalah kedaruratan medis. Segera hubungi hotline pencegahan bunuh diri atau pergi ke IGD terdekat. Kehidupan Anda berharga, dan masa sulit ini bersifat sementara.</p>
        `
      }
    ];

    function getContentById(id) {
        return contents.find(c => c.id == id);
    }

    // Actions
    function addToHistory(article) {
        if (!authStore.user?.email) return;

        const historyItem = {
            id: Date.now(), // Unique ID for the history entry
            userEmail: authStore.user.email,
            articleId: article.id,
            title: article.title,
            desc: article.description,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            category: article.category,
            type: article.type || 'Artikel',
            link: "Lihat Detail",
            action: "Baca Ulang"
        };
        
        allHistory.value.push(historyItem);
        saveToLocalStorage();
    }

    function saveToLocalStorage() {
        localStorage.setItem('pedulimental_article_history', JSON.stringify(allHistory.value));
    }

    return { 
        history, 
        contents,
        getContentById,
        addToHistory 
    };
});
