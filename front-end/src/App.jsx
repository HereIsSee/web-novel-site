import Header from "./components/Header";

function App({ children }) {
  return (
    <div className="app-layout">
      <Header />

      <main className="app-content">{children}</main>
    </div>
  );
}

export default App;
