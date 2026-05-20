import React, { useState, useEffect, useMemo } from 'react';
import { 
  School, Search, X, CheckCircle, AlertCircle, BookOpen, User, LogOut, 
  Send, Loader2, Clock, FileText, Award, ChevronLeft, ChevronRight, PlayCircle, 
  Trophy, PartyPopper, Zap, Frown, Lightbulb, LayoutGrid
} from 'lucide-react';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyERXeSitcQkNKj_pvDHxNbd_uJDNSdcR3P1_InJPBbROK_4741__W_t6N8w3cevZoAoQ/exec";

const PRAISE_QUOTES = [
  "Gokil! Jawabanmu bener bangetz! 🔥",
  "Sheesh! Pinter amat sih kamu, auto A+ ini mah! ✨",
  "Ngeri... ngeri... kamu calon juara kelas ya? 😎",
  "Mantap Jiwa! Pertahankan performa gacormu! 🚀",
  "Skill Bahasa Inggrismu sudah setingkat warga London! 🇬🇧"
];

const ENCOURAGE_QUOTES = [
  "Waduh zeyeng, hampir bener! Semangat ya! 😂",
  "Yah meleset dikit... gapapa, belajar dari salah itu cara paling pro! 🔥",
  "Don't sad ya! Salah itu biasa, yang luar biasa itu yang tetep usaha. 💪",
  "Duh, mungkin kamu butuh asupan es teh? Fokus lagi ya! 🥤",
  "Meleset nih, tapi tenang... kegagalan adalah jalan menuju kesuksesan! 🍜"
];

const ENV_TEXT = `<b>Read the text for questions 1-15:</b><br/><div class="bg-indigo-50 p-4 rounded-xl text-sm italic my-2 border-l-4 border-indigo-400">"How can we save the environment in our daily activities? There are many simple actions you can do to protect the earth. Everything begins with awareness. When you understand your impact on nature, you will realize why taking action is important. Your behavior can also inspire people around you. Most of the activities below are beneficial for both humans and the environment. For instance, bringing reusable shopping bags can reduce plastic waste. Here are some other ways to help save the environment:<br><br>Use reusable bottles: Reusable bottles help reduce single-use plastic waste. Plastic pollution can damage humans, animals, and plants. Plastic takes a very long time to decompose, so it becomes dangerous for the environment.<br>Join volunteer activities and educate others: Your positive actions can influence many people. You can join community clean-up programs or pick up rubbish around your neighborhood. Share your experiences with your friends and family to motivate them.<br>Do not throw chemicals into rivers: Harmful chemicals from cleaning products often flow into rivers and seas. Using safe and non-toxic products can help protect nature.<br>Ride bicycles more often: Riding a bicycle instead of driving a car can reduce air pollution because bicycles do not produce carbon emissions."</div>`;

const QUESTION_BANK = {
  8: [
    // READING 1-15
    { id: 1, type: "Reading", text: ENV_TEXT + "Based on the text, awareness means....", options: ["destroying the earth", "starting to protect the earth", "harming the environment", "polluting the river"], correctIndex: 1, explanation: "Di teks disebutkan 'Everything begins with awareness... to protect the earth', jadi awareness artinya mulai sadar untuk menjaga bumi." },
    { id: 2, type: "Reading", text: ENV_TEXT + "Why should people become aware?", options: ["To ignore the problem", "To avoid responsibility", "To take action", "To create pollution"], correctIndex: 2, explanation: "Teks menyatakan 'you will realize why taking action is important'. Kesadaran menuntun kita untuk beraksi." },
    { id: 3, type: "Reading", text: ENV_TEXT + "What is the advantage of using reusable bottles?", options: ["Increasing plastic waste", "Avoiding plastic pollution", "Damaging nature", "Producing more rubbish"], correctIndex: 1, explanation: "Botol yang bisa dipakai ulang (reusable) membantu mengurangi sampah plastik sekali pakai." },
    { id: 4, type: "Reading", text: ENV_TEXT + "What can plastic pollution do?", options: ["Improve the environment", "Harm humans and animals", "Increase air quality", "Reduce pollution"], correctIndex: 1, explanation: "Polusi plastik berbahaya bagi makhluk hidup (humans, animals, and plants)." },
    { id: 5, type: "Reading", text: ENV_TEXT + "Your good actions can....", options: ["influence other people", "make people angry", "create danger", "reduce awareness"], correctIndex: 0, explanation: "Teks menyebutkan 'Your positive actions can influence many people'." },
    { id: 6, type: "Reading", text: ENV_TEXT + "Is plastic easy to decompose?", options: ["Yes, in one day", "Yes, in one week", "No, it needs many years", "No, in two hours"], correctIndex: 2, explanation: "Plastik butuh waktu yang sangat lama untuk terurai secara alami (takes a very long time to decompose)." },
    { id: 7, type: "Reading", text: ENV_TEXT + "To reduce pollution, we should....", options: ["throw rubbish everywhere", "use reusable bottles", "burn plastic waste", "use more plastic bags"], correctIndex: 1, explanation: "Menggunakan botol reusable adalah aksi nyata yang disebutkan di teks untuk mengurangi polusi." },
    { id: 8, type: "Reading", text: ENV_TEXT + "Why do people use reusable bottles?", options: ["To increase waste", "To reduce plastic use", "To pollute rivers", "To damage nature"], correctIndex: 1, explanation: "Tujuannya jelas untuk mengurangi ketergantungan pada plastik sekali pakai." },
    { id: 9, type: "Reading", text: ENV_TEXT + "The following are ways to protect the environment, except....", options: ["joining volunteer activities", "using non-toxic products", "using disposable plastics", "riding bicycles"], correctIndex: 2, explanation: "Kecuali (except): Menggunakan plastik sekali pakai (disposable plastics) justru merusak lingkungan." },
    { id: 10, type: "Reading", text: ENV_TEXT + "Chemicals usually end up in....", options: ["oceans", "cupboards", "classrooms", "baskets"], correctIndex: 0, explanation: "Bahan kimia berbahaya dari produk pembersih biasanya mengalir ke sungai dan laut (oceans/seas)." },
    { id: 11, type: "Reading", text: ENV_TEXT + "Riding a bicycle helps to....", options: ["increase pollution", "reduce carbon emissions", "produce smoke", "create trash"], correctIndex: 1, explanation: "Sepeda tidak punya knalpot, jadi tidak menghasilkan emisi karbon." },
    { id: 12, type: "Reading", text: ENV_TEXT + "What happens if plastic waste is difficult to decompose?", options: ["It becomes harmless", "It improves nature", "It is dangerous for the environment", "It helps plants grow"], correctIndex: 2, explanation: "Karena lama terurai, plastik menumpuk dan menjadi bahaya bagi ekosistem (dangerous for the environment)." },
    { id: 13, type: "Reading", text: ENV_TEXT + "The negative effects of plastic pollution are below, except....", options: ["harming humans", "harming animals", "harming plants", "improving nature"], correctIndex: 3, explanation: "Polusi plastik TIDAK AKAN memperbaiki alam (improving nature)." },
    { id: 14, type: "Reading", text: ENV_TEXT + "How can we protect the environment?", options: ["Educate people around us", "Ignore the environment", "Throw rubbish carelessly", "Leave dirty places"], correctIndex: 0, explanation: "Salah satu caranya adalah mengedukasi orang lain (educate others) agar ikut peduli." },
    { id: 15, type: "Reading", text: ENV_TEXT + "What volunteer activity is mentioned in the text?", options: ["Community clean-up event", "Football competition", "Music festival", "School holiday program"], correctIndex: 0, explanation: "Teks menyebutkan 'community clean-up' (kerja bakti lingkungan)." },
    
    // VOCABULARY & CONCEPTS 16-28
    { id: 16, type: "Vocabulary", text: "Plastic belongs to....", options: ["organic waste", "inorganic waste", "natural fertilizer", "biodegradable waste"], correctIndex: 1, explanation: "Plastik adalah benda mati yang tidak bisa membusuk, sehingga termasuk sampah anorganik." },
    { id: 17, type: "Vocabulary", text: "We recycle plastic bottles by....", options: ["throwing them into rivers", "using them as useful objects", "burning them immediately", "burying them carelessly"], correctIndex: 1, explanation: "Recycle berarti mengolah sampah kembali menjadi benda yang berguna." },
    { id: 18, type: "Vocabulary", text: "Asking friends to protect nature means....", options: ["educating them", "avoiding them", "insulting them", "ignoring them"], correctIndex: 0, explanation: "Mengajak teman melindungi alam sama dengan mengedukasi (memberi tahu hal baik)." },
    { id: 19, type: "Vocabulary", text: "Which waste is easy to decompose?", options: ["Plastic", "Glass", "Vegetable waste", "Cans"], correctIndex: 2, explanation: "Sisa sayuran (vegetable waste) adalah sampah organik yang sangat mudah membusuk/terurai." },
    { id: 20, type: "Vocabulary", text: "To reduce pollution, except....", options: ["riding bicycles", "cleaning the environment", "throwing trash into bins", "driving cars all day"], correctIndex: 3, explanation: "Mengendarai mobil seharian justru menambah gas buang dan polusi udara." },
    { id: 21, type: "Vocabulary", text: "People work together to clean the environment because....", options: ["cleanliness is unimportant", "cleanliness is valuable", "dirty places are better", "pollution is harmless"], correctIndex: 1, explanation: "Orang bekerja bakti karena kebersihan itu sangat berharga/penting (valuable)." },
    { id: 22, type: "Vocabulary", text: "Which one is organic waste?", options: ["Plastic cup", "Aluminum can", "Food leftovers", "Glass bottle"], correctIndex: 2, explanation: "Sisa makanan (food leftovers) adalah bahan alami yang bisa terurai, disebut organik." },
    { id: 23, type: "Vocabulary", text: "Which action is correct when disposing rubbish?", options: ["Throwing it into rivers", "Throwing it into oceans", "Putting it into bins", "Throwing it onto roads"], correctIndex: 2, explanation: "Cara membuang sampah yang benar adalah meletakkannya di tempat sampah (bins)." },
    { id: 24, type: "Vocabulary", text: "Working for society voluntarily means....", options: ["refusing to help", "volunteering yourself", "skipping activities", "rejecting programs"], correctIndex: 1, explanation: "Voluntarily berasal dari kata volunteer (sukarelawan), yang artinya mengajukan diri tanpa paksaan/bayaran." },
    { id: 25, type: "Vocabulary", text: "Using plastic items again is called....", options: ["recycle", "pollution", "decomposition", "contamination"], correctIndex: 0, explanation: "Menggunakan kembali (atau mendaur ulang) barang plastik disebut recycle (3R: Reduce, Reuse, Recycle)." },
    { id: 26, type: "Vocabulary", text: "Cleaning your yard every day means....", options: ["you protect your environment", "you dislike cleanliness", "you ignore pollution", "you create waste"], correctIndex: 0, explanation: "Membersihkan halaman adalah bentuk nyata menjaga dan melindungi lingkungan." },
    { id: 27, type: "Vocabulary", text: "Reusable bottles help us to....", options: ["increase plastic waste", "reduce plastic use", "produce pollution", "throw rubbish away"], correctIndex: 1, explanation: "Botol yang bisa dicuci dan dipakai lagi membantu kita mengurangi penggunaan plastik (reduce plastic use)." },
    { id: 28, type: "Vocabulary", text: "Keeping trash in a litter bag means....", options: ["throwing it into rivers", "polluting the streets", "avoiding littering", "burning rubbish"], correctIndex: 2, explanation: "Menyimpan sampah sementara di kantong berarti kita menghindari membuang sampah sembarangan (avoiding littering)." },
    
    // SYMBOLS 29-30
    { id: 29, type: "Symbol", text: "Choose the correct statement according to the symbol: (♻️ Recycle)", options: ["Throw trash into rivers", "Reuse bags and containers", "Burn plastic waste", "Use aerosol spray carelessly"], correctIndex: 1, explanation: "Simbol daur ulang (♻️) mengajak kita untuk menggunakan kembali wadah atau mendaur ulang." },
    { id: 30, type: "Symbol", text: "Choose the correct statement according to the symbol: (🌱 Planting)", options: ["Plant more trees", "Cut down forests", "Throw chemicals away", "Waste clean water"], correctIndex: 0, explanation: "Ikon tanaman (🌱) melambangkan penghijauan atau menanam pohon." },
    
    // ADVERB OF MANNER 31-35
    { id: 31, type: "Adverb", text: "The stars shone … in the sky.", options: ["brightly", "slowly", "carelessly", "sadly"], correctIndex: 0, explanation: "Bintang bersinar dengan terang (brightly)." },
    { id: 32, type: "Adverb", text: "You should walk … on the slippery floor.", options: ["quickly", "carefully", "loudly", "happily"], correctIndex: 1, explanation: "Di lantai licin (slippery floor), kita harus berjalan dengan hati-hati (carefully)." },
    { id: 33, type: "Adverb", text: "Rina answered the question ….", options: ["correctly", "slowly", "sadly", "heavily"], correctIndex: 0, explanation: "Menjawab pertanyaan paling cocok dipasangkan dengan 'dengan benar' (correctly)." },
    { id: 34, type: "Adverb", text: "The children played … in the playground.", options: ["happily", "angrily", "cruelly", "heavily"], correctIndex: 0, explanation: "Anak-anak bermain di taman bermain dengan gembira (happily)." },
    { id: 35, type: "Adverb", text: "Snails move very ….", options: ["quickly", "slowly", "carefully", "brightly"], correctIndex: 1, explanation: "Siput (snails) dikenal bergerak sangat lambat (slowly)." },
    
    // SIMPLE PAST TENSE 36-40
    { id: 36, type: "Past Tense", text: "Dika … his homework yesterday.", options: ["finish", "finished", "finishing", "finishes"], correctIndex: 1, explanation: "Gunakan Verb 2 (finished) karena ada penanda waktu masa lampau 'yesterday'." },
    { id: 37, type: "Past Tense", text: "Sinta and Rani … at the library last week.", options: ["meet", "met", "meeting", "meets"], correctIndex: 1, explanation: "Bentuk Verb 2 dari 'meet' adalah 'met'. Dipakai karena ada kata 'last week'." },
    { id: 38, type: "Past Tense", text: "Father … me a new bag last night.", options: ["gives", "gave", "giving", "gived"], correctIndex: 1, explanation: "Bentuk Verb 2 (tidak beraturan) dari 'give' adalah 'gave'." },
    { id: 39, type: "Past Tense", text: "They … the competition successfully.", options: ["win", "won", "winning", "wins"], correctIndex: 1, explanation: "Bentuk Verb 2 dari 'win' adalah 'won'." },
    { id: 40, type: "Past Tense", text: "We … the garbage into the bins properly yesterday.", options: ["put", "puts", "puted", "putting"], correctIndex: 0, explanation: "Kata 'put' adalah irregular verb. Verb 1, Verb 2, dan Verb 3-nya tetap 'put'. (Tidak ada puted)." },

    // ESSAY 41-45
    { id: 41, type: "Essay", text: "Make 3 sentences about environmental pollution!", isEssay: true, explanation: "Jawaban guru (Bebas). Contoh: 1. Plastic pollutes the river. 2. Cars produce carbon emission. 3. People throw garbage everywhere." },
    { id: 42, type: "Essay", text: "Why is protecting the environment important?", isEssay: true, explanation: "Jawaban guru (Bebas). Contoh: It is important because we need a healthy earth to live safely." },
    { id: 43, type: "Essay", text: "How do you educate your friends about cleanliness?", isEssay: true, explanation: "Jawaban guru (Bebas). Contoh: By telling them to throw trash into the bins and not using single-use plastics." },
    { id: 44, type: "Essay", text: "Make 3 sentences using simple past tense!", isEssay: true, explanation: "Jawaban guru (Bebas). Contoh: 1. I went to Bali last year. 2. She studied hard last night. 3. They played football yesterday." },
    { id: 45, type: "Essay", text: "Make 1 sentence using these words:<br>a. Quickly<br>b. Carefully", isEssay: true, explanation: "Jawaban guru (Bebas). Contoh: The boy ran quickly and crossed the road carefully." }
  ],
  7: [ 
    { id: 1, type: "Intro", text: "Greetings in English...", options: ["Hi", "Bye", "Sad", "No"], correctIndex: 0, explanation: "Hi adalah kata sapaan standar." }
  ],
  9: [ 
    { id: 1, type: "Report", text: "The Elephant is...", options: ["Mammal", "Fish", "Bird", "Insects"], correctIndex: 0, explanation: "Gajah menyusui anaknya, maka termasuk mamalia." }
  ]
};

export default function App() {
  const [view, setView] = useState('login'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ name: '', grade: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuestions = useMemo(() => {
    return QUESTION_BANK[currentUser?.grade] || [];
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.name || !loginForm.grade) return;
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: loginForm.name, kelas: loginForm.grade })
      });
    } catch (err) { console.error(err); }
    setCurrentUser(loginForm);
    setView('dashboard');
    setIsSubmitting(false);
  };

  if (view === 'login') return <LoginView loginForm={loginForm} setLoginForm={setLoginForm} handleLogin={handleLogin} isSubmitting={isSubmitting} />;
  if (view === 'dashboard') return <DashboardView user={currentUser} setView={setView} onLogout={() => setView('login')} totalQuestions={activeQuestions.length} />;
  if (view === 'kisi') return <KisiView questions={activeQuestions} setView={setView} grade={currentUser.grade} />;
  if (view === 'quiz') return (
    <QuizView 
      questions={activeQuestions} 
      currentIdx={currentIdx} 
      setCurrentIdx={setCurrentIdx}
      answers={answers}
      setAnswers={setAnswers}
      setView={setView}
      quizFinished={quizFinished}
      setQuizFinished={setQuizFinished}
    />
  );
}

function LoginView({ loginForm, setLoginForm, handleLogin, isSubmitting }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl mb-4 rotate-6">
            <School size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter text-center uppercase">E-KISI PAT 2025</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">MTs Al Istiqomah • Absensi Aktif</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1">Nama Lengkap Siswa</label>
            <div className="relative">
              <User className="absolute left-4 top-4 text-slate-300" size={20} />
              <input 
                required 
                type="text" 
                placeholder="Ketik namamu..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 outline-none transition-all font-bold"
                value={loginForm.name}
                onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1">Pilih Kelas</label>
            <div className="grid grid-cols-3 gap-3">
              {[7, 8, 9].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setLoginForm({...loginForm, grade: g})}
                  className={`py-4 rounded-2xl border-2 font-black text-xl transition-all ${loginForm.grade === g ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting || !loginForm.name || !loginForm.grade}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><PlayCircle size={22} /> MASUK & ABSEN</>}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardView({ user, setView, onLogout, totalQuestions }) {
  return (
    <div className="min-h-screen bg-indigo-50/50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl uppercase shadow-md">{user.name.charAt(0)}</div>
            <div>
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
              <p className="text-xs text-indigo-500 font-bold uppercase">Siswa Kelas {user.grade} • MTs Al Istiqomah</p>
            </div>
          </div>
          <button onClick={onLogout} className="text-rose-500 font-bold text-sm flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-rose-50 transition-colors border border-rose-50"><LogOut size={16}/> Keluar</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setView('kisi')}>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Lihat Kisi-Kisi</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">Pelajari ringkasan materi untuk persiapan PAT 2025.</p>
            <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase">Buka Ringkasan <ChevronRight size={16} /></div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setView('quiz')}>
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Zap size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Mulai Latihan</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">Kerjakan simulasi {totalQuestions} soal kuis dengan koreksi instan!</p>
            <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase">Mulai Gacor <ChevronRight size={16} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KisiView({ questions, setView, grade }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = questions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 pb-24">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => setView('dashboard')} className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors"><ChevronLeft size={20}/> Kembali</button>
        
        <div className="bg-slate-900 rounded-[2rem] p-10 text-white mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 hidden sm:block"><School size={100}/></div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">KISI-KISI PAT 2025</h1>
          <p className="text-indigo-400 font-bold text-sm tracking-[0.2em] uppercase">Bahasa Inggris Kelas {grade} • 120 Menit</p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari materi soal..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl">
          <table className="w-full text-left bg-white min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 text-center font-black text-slate-400 uppercase text-[10px] w-20">No</th>
                <th className="p-6 font-black text-slate-800 uppercase text-[10px] w-32">Materi</th>
                <th className="p-6 font-black text-slate-800 uppercase text-[10px]">Indikator Soal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((q, idx) => (
                <tr key={q.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="p-6 text-center font-mono font-bold text-slate-400">{q.id}</td>
                  <td className="p-6">
                    <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-[10px] uppercase">{q.type}</span>
                  </td>
                  <td className="p-6 text-slate-500 font-medium text-sm leading-relaxed">{q.text.replace(/<[^>]*>/g, '').substring(0, 100)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function QuizView({ questions, currentIdx, setCurrentIdx, answers, setAnswers, setView, quizFinished, setQuizFinished }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackQuote, setFeedbackQuote] = useState("");
  const [showNavModal, setShowNavModal] = useState(false);
  
  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const progress = ((currentIdx + 1) / totalQuestions) * 100;

  // Cek apakah user sudah pernah menjawab soal ini sebelumnya
  useEffect(() => {
    if (answers[currentQ.id] !== undefined) {
      setShowFeedback(true);
    } else {
      setShowFeedback(false);
    }
  }, [currentIdx, answers, currentQ.id]);

  const handleSelect = (idx) => {
    if (showFeedback) return;
    const isCorrect = idx === currentQ.correctIndex;
    const quotes = isCorrect ? PRAISE_QUOTES : ENCOURAGE_QUOTES;
    setFeedbackQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    setAnswers({ ...answers, [currentQ.id]: idx });
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    const score = questions.filter(q => !q.isEssay && answers[q.id] === q.correctIndex).length;
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-md w-full">
          <Trophy className="mx-auto mb-6 text-emerald-500 sm:w-[64px] sm:h-[64px]" size={48} />
          <h2 className="text-3xl font-black text-slate-800 mb-2">Latihan Selesai!</h2>
          <div className="bg-slate-50 p-8 rounded-3xl my-8 border border-slate-100">
            <span className="block text-slate-400 text-[10px] font-black uppercase mb-1">Skor Pilihan Ganda</span>
            <span className="text-6xl font-black text-indigo-600">{score}</span>
            <span className="text-slate-400 font-bold"> / {questions.filter(q => !q.isEssay).length}</span>
          </div>
          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-lg uppercase tracking-wider">KEMBALI KE BERANDA</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><X size={20}/></button>
          <div>
            <h3 className="font-black text-slate-800 text-xs uppercase">Soal No. {currentQ.id}</h3>
            <div className="w-32 h-1 bg-slate-100 rounded-full mt-0.5 overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowNavModal(true)} 
          className="bg-indigo-50 hover:bg-indigo-100 transition-colors px-3 py-2 rounded-lg text-indigo-600 font-black text-[10px] uppercase flex items-center gap-2 shadow-sm"
        >
          <LayoutGrid size={14} /> {currentIdx + 1} / {totalQuestions}
        </button>
      </div>

      {/* MODAL NAVIGASI GRID SOAL */}
      {showNavModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowNavModal(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[3rem] p-6 max-h-[85vh] flex flex-col shadow-2xl transition-transform" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-slate-800 text-lg">Navigasi Soal</h3>
                <p className="text-xs font-bold text-slate-400">Pilih nomor untuk melompat</p>
              </div>
              <button onClick={() => setShowNavModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-rose-100 hover:text-rose-600 transition-colors rounded-full text-slate-500"><X size={18}/></button>
            </div>
            
            <div className="overflow-y-auto pr-2 pb-4 scrollbar-thin">
              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, i) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = currentIdx === i;
                  let btnStyle = "bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-300";
                  
                  if (isCurrent) {
                    btnStyle = "bg-indigo-600 border-indigo-600 text-white shadow-md ring-4 ring-indigo-100";
                  } else if (isAnswered) {
                    btnStyle = "bg-emerald-100 border-emerald-200 text-emerald-700 font-black";
                  }
                  
                  return (
                    <button 
                      key={q.id} 
                      onClick={() => { setCurrentIdx(i); setShowNavModal(false); }}
                      className={`w-full aspect-square flex items-center justify-center font-bold text-sm border-2 rounded-[1rem] transition-all ${btnStyle}`}
                    >
                      {q.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-5 border-t border-slate-100 flex gap-4 justify-center text-[10px] font-black uppercase tracking-wider text-slate-400">
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-md bg-emerald-100 border-2 border-emerald-200"></div> Selesai</div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-md bg-slate-50 border-2 border-slate-200"></div> Kosong</div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-md bg-indigo-600"></div> Saat Ini</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-32">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-[10px] uppercase mb-4">{currentQ.type}</span>
          <div className="text-lg font-medium text-slate-700 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: currentQ.text }} />

          {currentQ.isEssay ? (
            <div className="space-y-4">
              <textarea 
                className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl h-40 outline-none focus:border-indigo-300 font-bold"
                placeholder="Tuliskan jawaban uraianmu di sini..."
                value={answers[currentQ.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
              />
              <button 
                onClick={() => setShowFeedback(true)}
                className="w-full py-4 bg-indigo-100 text-indigo-700 font-black rounded-2xl"
              >
                Cek Kunci Jawaban Essay
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = "bg-white border-slate-100 hover:border-indigo-100";
                
                if (showFeedback) {
                   if (isCorrect) btnStyle = "bg-emerald-500 border-emerald-500 text-white shadow-md scale-[1.02]";
                   else if (isSelected) btnStyle = "bg-rose-500 border-rose-500 text-white shadow-md";
                   else btnStyle = "bg-white border-slate-50 opacity-40";
                } else if (isSelected) {
                   btnStyle = "bg-indigo-600 border-indigo-600 text-white shadow-lg";
                }

                return (
                  <button key={idx} disabled={showFeedback} onClick={() => handleSelect(idx)} className={`w-full p-5 rounded-[1.5rem] border-2 text-left transition-all flex items-center gap-6 ${btnStyle}`}>
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shrink-0 ${isSelected || (showFeedback && isCorrect) ? 'bg-white/20 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-bold text-lg leading-tight">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback Section */}
          {showFeedback && (
            <div className="mt-8 space-y-4 animate-in slide-in-from-top-4">
              {!currentQ.isEssay && (
                <div className={`p-6 rounded-[2rem] flex items-start gap-4 ${answers[currentQ.id] === currentQ.correctIndex ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {answers[currentQ.id] === currentQ.correctIndex ? <PartyPopper size={24} className="shrink-0"/> : <Frown size={24} className="shrink-0"/>}
                  <div>
                    <p className="font-black text-lg mb-1">{answers[currentQ.id] === currentQ.correctIndex ? "Keren Parah!" : "Yah, Kurang Tepat.."}</p>
                    <p className="font-medium text-sm">{feedbackQuote || (answers[currentQ.id] === currentQ.correctIndex ? "Pertahankan!" : "Coba perhatikan penjelasannya ya.")}</p>
                  </div>
                </div>
              )}

              <div className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-[2rem] text-indigo-900 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                  <Lightbulb size={16} /> {currentQ.isEssay ? "Contoh Jawaban Guru" : "Penjelasan Materi"}
                </div>
                <p className="font-bold text-sm leading-relaxed italic">"{currentQ.explanation}"</p>
                
                {!currentQ.isEssay && answers[currentQ.id] !== currentQ.correctIndex && (
                  <div className="mt-4 pt-4 border-t border-indigo-100">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Kunci Jawaban Benar:</p>
                    <p className="text-emerald-600 font-black text-lg">{currentQ.options[currentQ.correctIndex]}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white/95 backdrop-blur-md fixed bottom-0 left-0 w-full z-20 flex justify-between items-center gap-4">
        <button 
          disabled={currentIdx === 0} 
          onClick={() => { setCurrentIdx(currentIdx - 1); }} 
          className="flex-1 max-w-[140px] py-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all border border-slate-200"
        >
          <ChevronLeft size={18}/> BACK
        </button>

        <button 
          disabled={!showFeedback && !currentQ.isEssay} 
          onClick={handleNext} 
          className={`flex-1 max-w-[180px] py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 ${currentIdx === totalQuestions - 1 ? 'bg-indigo-600' : 'bg-slate-900'}`}
        >
          {currentIdx === totalQuestions - 1 ? (
            <>FINISH <Award size={18}/></>
          ) : (
            <>NEXT <ChevronRight size={18}/></>
          )}
        </button>
      </div>
    </div>
  );
}
