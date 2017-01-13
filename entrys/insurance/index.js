/**
 * Created by outstudio on 16/5/6.
 */
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './modules/App.jsx';
import MainPage from './modules/MainPage.jsx';
import HomePage from './component/HomePage.jsx';
import MainSection from './modules/MainSection.jsx';

render((
    <Router history={browserHistory}>
        <Route path={window.App.getAppRoute()} component={App}>
            <IndexRoute component={HomePage}/>
            <Route path={window.App.getAppRoute()+"/"} component={HomePage}/>
            <Route path={window.App.getAppRoute()+"/mainPage"} component={MainPage}/>
            <Route path={window.App.getAppRoute()+"/productCenter"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/news"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/personalCenter"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/consult"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/aboutUs"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/personInfo"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/lifeInsurance"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/carInsurance"} component={MainSection}/>
            <Route path={window.App.getAppRoute()+"/lifeDetail"} component={MainSection}/>


        </Route>
    </Router>
), document.getElementById('root'))
