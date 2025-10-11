import Header from './components/Header';
import Home from './routes/Home';
import Novel from './routes/Novel';
import CreateNovel from './routes/CreateNovel';

function App({children}) {

  return (
    <div>
      <Header />
      {/* <Novel /> */}
      {/* <CreateNovel /> */}
      {children}
    </div>
  )
}

export default App
