import React, { useState, useEffect, useMemo } from 'react';
import { 
  School, Search, Printer, X, CheckCircle, AlertCircle, BookOpen, User, LogOut, 
  Send, Loader2, Clock, FileText, Award, ChevronLeft, ChevronRight, PlayCircle, 
  Trophy, PartyPopper, Zap, Frown, Lightbulb, Menu, Info, Share2
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

const ENV_TEXT = `<b>Read the text for questions 1-15:</b><br/><div class="bg-indigo-50 p-4 rounded-xl text-sm italic my-2 border-l-4 border-indigo-400">"How can we save the environment in our daily activities? There are many simple actions you can do to protect the earth. Everything begins with awareness. When you understand your impact on nature, you will realize why taking action is important. Your behavior can also inspire people around you. Bringing reusable shopping bags can reduce plastic waste. Use reusable bottles to help reduce single-use plastic waste. Join volunteer activities like community clean-up. Do not throw chemicals into rivers. Ride bicycles to reduce air pollution and carbon emissions."</div>`;

const QUESTION_BANK = {
  8: [
    { id: 1, type: "Reading", text: ENV_TEXT + "Based on the text, awareness means....", options: ["destroying the earth", "starting to protect the earth", "harming the environment", "polluting the river"], correctIndex: 1, explanation: "Di teks disebutkan 'Everything begins with awareness... to protect the earth', jadi awareness artinya mulai sadar untuk menjaga bumi." },
    { id: 2, type: "Reading", text: ENV_TEXT + "Why should people become aware?", options: ["To ignore the problem", "To avoid responsibility", "To take action", "To create pollution"], correctIndex: 2, explanation: "Teks menyatakan 'you will realize why taking action is important'. Kesadaran menuntun kita untuk beraksi." },
    { id: 3, type: "Reading", text: ENV_TEXT + "What is the advantage of using reusable bottles?", options: ["Increasing plastic waste", "Avoiding plastic pollution", "Damaging nature", "Producing more rubbish"], correctIndex: 1, explanation: "Botol yang bisa dipakai ulang (reusable) membantu mengurangi sampah plastik sekali pakai." },
    { id: 4, type: "Reading", text: ENV_TEXT + "What can plastic pollution do?", options: ["Improve the environment", "Harm humans and animals", "Increase air quality", "Reduce pollution"], correctIndex: 1, explanation: "Polusi plastik berbahaya bagi makhluk hidup (humans, animals, and plants)." },
    { id: 5, type: "Reading", text: ENV_TEXT + "Your good actions can....", options: ["influence other people", "make people angry", "create danger", "reduce awareness"], correctIndex: 0, explanation: "Teks menyebutkan 'Your behavior can also inspire people around you'." },
    { id: 6, type: "Reading", text: ENV_TEXT + "Is plastic easy to decompose?", options: ["Yes, in one day", "Yes, in one week", "No, it needs many years", "No, in two hours"], correctIndex: 2, explanation: "Plastik butuh waktu yang sangat lama untuk terurai secara alami (decompose)." },
    { id: 7, type: "Reading", text: ENV_TEXT + "To reduce pollution, we should....", options: ["throw rubbish everywhere", "use reusable bottles", "burn plastic waste", "use more plastic bags"], correctIndex: 1, explanation: "Menggunakan botol reusable adalah aksi nyata yang disebutkan di teks untuk mengurangi polusi." },
    { id: 8, type: "Reading", text: ENV_TEXT + "Why do people use reusable bottles?", options: ["To increase waste", "To reduce plastic use", "To pollute rivers", "To damage nature"], correctIndex: 1, explanation: "Tujuannya jelas untuk mengurangi ketergantungan pada plastik sekali pakai." },
    { id: 9, type: "Reading", text: ENV_TEXT + "The following are ways to protect the environment, except....", options: ["joining volunteer activities", "using non-toxic products", "using disposable plastics", "riding bicycles"], correctIndex: 2, explanation: "Kecuali (except): Menggunakan plastik sekali pakai (disposable plastics) justru merusak lingkungan." },
    { id: 10, type: "Reading", text: ENV_TEXT + "Chemicals usually end up in....", options: ["oceans", "cupboards", "classrooms", "baskets"], correctIndex: 0, explanation: "Bahan kimia berbahaya dari produk pembersih biasanya mengalir ke sungai dan laut (oceans)." },
    { id: 11, type: "Reading", text: ENV_TEXT + "Riding a bicycle helps to....", options: ["increase pollution", "reduce carbon emissions", "produce smoke", "create trash"], correctIndex: 1, explanation: "Sepeda tidak punya knalpot, jadi tidak menghasilkan emisi karbon." },
    { id: 12, type: "Reading", text: ENV_TEXT + "What happens if plastic waste is difficult to decompose?", options: ["It becomes harmless", "It improves nature", "It is dangerous for the environment", "It helps plants grow"], correctIndex: 2, explanation: "Karena lama terurai, plastik menumpuk dan menjadi bahaya bagi ekosistem." },
    { id: 13, type: "Reading", text: ENV_TEXT + "The negative effects of plastic pollution are below, except....", options: ["harming humans", "harming animals", "harming plants", "improving nature"], correctIndex: 3, explanation: "Polusi plastik TIDAK AKAN memperbaiki alam (improving nature)." },
    { id: 14, type: "Reading", text: ENV_TEXT + "How can we protect the environment?", options: ["Educate people around us", "Ignore the environment", "Throw rubbish carelessly", "Leave dirty places"], correctIndex: 0, explanation: "Salah satu caranya adalah mengedukasi orang lain agar ikut peduli." },
    { id: 15, type: "Reading", text: ENV_TEXT + "What volunteer activity is mentioned in the text?", options: ["Community clean-up event", "Football competition", "Music festival", "School holiday program"], correctIndex: 0, explanation: "Teks menyebutkan 'community clean-up' (kerja bakti lingkungan)." },
    { id: 16, type: "Vocabulary", text: "Plastic belongs to....", options: ["organic waste", "inorganic waste", "natural fertilizer", "biodegradable waste"], correctIndex: 1, explanation: "Plastik adalah benda mati yang termasuk sampah anorganik." },
    { id: 17, type: "Vocabulary", text: "We recycle plastic bottles by....", options: ["throwing them into rivers", "using them as useful objects", "burning them immediately", "burying them carelessly"], correctIndex: 1, explanation: "Recycle berarti mengolah sampah menjadi benda berguna." },
    { id: 18, type: "Vocabulary", text: "Asking friends to protect nature means....", options: ["educating them", "avoiding them", "insulting them", "ignoring them"], correctIndex: 0, explanation: "Mengajak teman berarti melakukan edukasi lingkungan." },
    { id: 19, type: "Vocabulary", text: "Which waste is easy to decompose?", options: ["Plastic", "Glass", "Vegetable waste", "Cans"], correctIndex: 2, explanation: "Sisa sayuran adalah sampah organik yang mudah terurai." },
    { id: 20, type: "Vocabulary", text: "To reduce pollution, except....", options: ["riding bicycles", "cleaning the environment", "throwing trash into bins", "driving cars all day"], correctIndex: 3, explanation: "Mengendarai mobil seharian justru menambah polusi udara." },
    { id: 31, type: "Adverb", text: "The stars shone … in the sky.", options: ["brightly", "slowly", "carelessly", "sadly"], correctIndex: 0, explanation: "Bintang bersinar dengan terang (brightly)." },
    { id: 32, type: "Adverb", text: "You should walk … on the slippery floor.", options: ["quickly", "carefully", "loudly", "happily"], correctIndex: 1, explanation: "Lantai licin harus jalan dengan hati-hati (carefully)." },
    { id: 36, type: "Past Tense", text: "Dika … his homework yesterday.", options: ["finish", "finished", "finishing", "finishes"], correctIndex: 1, explanation: "Gunakan Verb 2 'finished' karena ada penanda waktu 'yesterday'." },
    { id: 41, type: "Essay", text: "Make 3 sentences about environmental pollution!", isEssay: true, explanation: "Contoh: Plastic harms nature. Air is dirty. Don't throw chemicals." }
  ],
  7: [ 
    { id: 1, type: "Intro", text: "Greetings in English...", options: ["Hi", "Bye", "Sad", "No"], correctIndex: 0, explanation: "Hi adalah kata sapaan standar." },
    { id: 2, type: "Vocabulary", text: "Which one is a fruit?", options: ["Carrot", "Apple", "Cabbage", "Spinach"], correctIndex: 1, explanation: "Apple adalah buah, sisanya sayuran." }
  ],
  9: [ 
    { id: 1, type: "Report", text: "The Elephant is...", options: ["Mammal", "Fish", "Bird", "Insects"], correctIndex: 0, explanation: "Gajah menyusui anaknya, maka termasuk mamalia." },
    { id: 2, type: "Narrative", text: "Once upon a time... refers to...", options: ["Future", "Present", "Past", "Now"], correctIndex: 2, explanation: "Keterangan waktu dongeng biasanya di masa lampau." }
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
  if (view === 'dashboard') return <DashboardView user={currentUser} setView={setView} onLogout={() => setView('login')} />;
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
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter text-center uppercase">E-KISI SAS 2025</h1>
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

function DashboardView({ user, setView, onLogout }) {
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
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">Pelajari indikator materi untuk persiapan SAS Gasal 2025 kelas {user.grade}.</p>
            <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase">Buka Ringkasan <ChevronRight size={16} /></div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setView('quiz')}>
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Zap size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Latihan Interaktif</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">Kerjakan simulasi soal kuis dengan koreksi dan penjelasan instan!</p>
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
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">KISI-KISI PAT 2025</h1>
          <p className="text-indigo-400 font-bold text-sm tracking-[0.2em] uppercase">Bahasa Inggris Kelas {grade}</p>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input type="text" placeholder="Cari materi..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-xl">
          <table className="w-full text-left bg-white min-w-[600px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-6 text-center font-black text-[10px] w-20 uppercase text-slate-400">No</th>
                <th className="p-6 font-black text-[10px] uppercase text-slate-800">Materi</th>
                <th className="p-6 font-black text-[10px] uppercase text-slate-800">Indikator</th>
                <th className="p-6 text-center font-black text-[10px] w-32 uppercase text-slate-800">Nomor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((q, idx) => (
                <tr key={q.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="p-6 text-center font-mono font-bold text-slate-300">{idx + 1}</td>
                  <td className="p-6 font-black text-[10px] uppercase text-indigo-600">{q.type}</td>
                  <td className="p-6 text-slate-500 font-medium text-sm leading-relaxed">{q.text.replace(/<[^>]*>/g, '').substring(0, 100)}...</td>
                  <td className="p-6 text-center"><span className="w-10 h-10 inline-flex items-center justify-center bg-slate-100 rounded-xl font-black text-slate-600 text-sm">{q.id}</span></td>
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
  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;
  const progress = ((currentIdx + 1) / totalQuestions) * 100;

  const handleSelect = (idx) => {
    if (showFeedback) return;
    const isCorrect = idx === currentQ.correctIndex;
    const quotes = isCorrect ? PRAISE_QUOTES : ENCOURAGE_QUOTES;
    setFeedbackQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setAnswers({ ...answers, [currentQ.id]: idx });
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentIdx < totalQuestions - 1) { setCurrentIdx(currentIdx + 1); } 
    else { setQuizFinished(true); }
  };

  if (quizFinished) {
    const score = questions.filter(q => !q.isEssay && answers[q.id] === q.correctIndex).length;
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-md w-full">
          <Trophy className="mx-auto mb-6 text-emerald-500" size={48} />
          <h2 className="text-3xl font-black text-slate-800 mb-2">Latihan Selesai!</h2>
          <div className="bg-slate-50 p-8 rounded-3xl my-8 border border-slate-100">
            <span className="block text-slate-400 text-[10px] font-black uppercase mb-1">Skor Pilihan Ganda</span>
            <span className="text-6xl font-black text-indigo-600">{score}</span>
            <span className="text-slate-400 font-bold"> / {questions.filter(q => !q.isEssay).length}</span>
          </div>
          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all uppercase">KEMBALI KE BERANDA</button>
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
        <div className="bg-indigo-50 px-3 py-1.5 rounded-lg text-indigo-600 font-black text-[10px] uppercase">{currentIdx + 1} / {totalQuestions}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-32">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-[10px] uppercase mb-4">{currentQ.type}</span>
          <div className="text-xl font-bold text-slate-700 leading-relaxed mb-10" dangerouslySetInnerHTML={{ __html: currentQ.text }} />
          {currentQ.isEssay ? (
            <textarea className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl h-40 outline-none font-bold" placeholder="Tuliskan jawabanmu..." value={answers[currentQ.id] || ''} onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })} />
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
                } else if (isSelected) { btnStyle = "bg-indigo-600 border-indigo-600 text-white shadow-lg"; }
                return (
                  <button key={idx} disabled={showFeedback} onClick={() => handleSelect(idx)} className={`w-full p-5 rounded-[1.5rem] border-2 text-left transition-all flex items-center gap-6 ${btnStyle}`}>
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shrink-0 ${isSelected ? 'bg-white/20 border-white/20' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                    <span className="font-bold text-lg leading-tight">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}
          {showFeedback && !currentQ.isEssay && (
            <div className="mt-8 space-y-4">
              <div className={`p-6 rounded-[2rem] flex items-start gap-4 ${answers[currentQ.id] === currentQ.correctIndex ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {answers[currentQ.id] === currentQ.correctIndex ? <PartyPopper size={24}/> : <Frown size={24}/>}
                <div>
                  <p className="font-black text-lg mb-1">{answers[currentQ.id] === currentQ.correctIndex ? "Keren Parah!" : "Yah, Kurang Tepat.."}</p>
                  <p className="font-medium text-sm">{feedbackQuote}</p>
                </div>
              </div>
              <div className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-[2rem] text-indigo-900 shadow-sm">
                <p className="font-bold text-sm leading-relaxed italic">"{currentQ.explanation}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 border-t border-slate-100 bg-white/95 backdrop-blur-md fixed bottom-0 left-0 w-full z-20 flex justify-between items-center gap-4">
        <button disabled={currentIdx === 0} onClick={() => { setCurrentIdx(currentIdx - 1); setShowFeedback(false); }} className="flex-1 max-w-[140px] py-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-sm border border-slate-200"><ChevronLeft size={18}/> BACK</button>
        <button disabled={!showFeedback && !currentQ.isEssay} onClick={handleNext} className={`flex-1 max-w-[180px] py-4 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${currentIdx === totalQuestions - 1 ? 'bg-indigo-600' : 'bg-slate-900'}`}>{currentIdx === totalQuestions - 1 ? <>FINISH <Award size={18}/></> : <>NEXT <ChevronRight size={18}/></>}</button>
      </div>
    </div>
  );
}