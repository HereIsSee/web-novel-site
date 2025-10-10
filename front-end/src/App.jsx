import Header from './components/Header';
import Home from './routes/Home';
import Novel from './routes/Novel';
import CreateNovel from './routes/CreateNovel';

function App() {

  return (
    <div>
      <Header />
      {/* <Novel /> */}
      <CreateNovel />
    </div>
  )
}

export default App
