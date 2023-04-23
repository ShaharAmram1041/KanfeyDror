import ContactForm from "./components/contactForm/ContactForm";
import "./App.css";
import Information from "./components/Information";
import FollowReport from "./components/FollowReport";
import SendReport from "./components/SendReport";
import Header from "./components/Header/Header";
function App() {
  return (
    <div className="app">
      <Header />
      <Information />
      <div className="reportButtonDiv">
        <FollowReport />
        <SendReport />
      </div>

      {/* <ContactForm /> */}
    </div>
  );
}

export default App;
