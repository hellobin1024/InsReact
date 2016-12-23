import React from 'react';
import {render} from 'react-dom';
import B from './B.jsx';

Boot();

function Boot(){

    render(
      <B type='b' sex='man' age={19}/>
        , document.getElementById('root'));

}