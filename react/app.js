import React, {Component} from "react";
import style from "./styles/app.css";
import {Affix, Button, Calendar, DatePicker, Input} from "antd";
const Search = Input.Search;

class App extends Component {
  render() {
    return (
      <div className={style.App}>
        <div className={style["App-header"]}>
          <h2>Welcome to Demeter</h2>
        </div>
        <p className={style["App-intro"]}>
            <DatePicker />
            <Affix>
                <Button type="primary">Affix top</Button>
            </Affix>
            <Search
                placeholder="input search text"
                style={{ width: 200 }}
                onSearch={value => console.log(value)}
            />
            <Calendar onPanelChange={() => {}} />
        </p>
      </div>
    );
  }
}

export default App;
