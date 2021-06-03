import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from './utility/history';
import Layout from './components/layout';
import SearchBar from './components/SearchBar';
import Home from "./pages/Home";
import Search from './pages/Search';
import Job from './pages/Job';
import Skill from './pages/Skill';
import NotFound from './pages/404';


const App : React.FC = () => {
  return (
    <Router history={history}>
      <div className="App">
        <Layout/>
        <Route exact path={["/", "/search"]} component={SearchBar} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/job/:id" component={Job} />
          <Route path="/skill/:id" component={Skill} />
          <Route  component={NotFound} />
        </Switch>
      </div>
    </Router>

  );
}

export default App;