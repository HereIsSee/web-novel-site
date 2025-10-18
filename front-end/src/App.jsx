import Header from './components/Header';
import Home from './routes/Home';
import Novel from './routes/Novel';
import CreateNovel from './routes/CreateNovel';

function App({children}) {

  return (
    <div className="app-layout">
      <Header />

      <main className="app-content">
        {children}
      </main>
    </div>
  )
}

export default App
