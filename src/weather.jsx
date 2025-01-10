import { useState, useEffect } from "react";

export default function Weather() {
  const [city, setCity] = useState("");
  const [name, setName] = useState(null);
  const [temp, setTemp] = useState(null);
  const [ftemp, setFtemp] = useState(null);
  const [humid, setHumid] = useState(null);
  const [time, setTime] = useState([]);
  const [timezone, setTimezone] = useState(null);

  async function getData() {
    try {
      const rawdata = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=5860da24653c33473fbc48cdc95eb5e8&units=metric`
      );
      const wthdata = await rawdata.json();
      if (!rawdata.ok) {
        setCity("");
        alert("查無此城市資料！請重新輸入");
        return;
      }
      setName(wthdata.name);
      setTemp(wthdata.main.temp);
      setFtemp(wthdata.main.feels_like);
      setHumid(wthdata.main.humidity);
      setTime([
        new Date().getUTCHours() + wthdata.timezone / 3600,
        new Date().getUTCMinutes(),
        new Date().getUTCSeconds(),
      ]);
      setTimezone(wthdata.timezone);
      setCity("");
    } catch (error) {
      console.error("資料取得失敗", error);
      alert("無法取得資料，請稍後再試！");
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime([
        new Date().getUTCHours() + timezone / 3600,
        new Date().getUTCMinutes(),
        new Date().getUTCSeconds(),
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [name, timezone]);

  return (
    <div id="main_div">
      <div id="wth2_div">
        <h1>Please Enter a City</h1>
        <input
          placeholder="Enter a City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getData();
            }
          }}
        ></input>
        <button id="btn_submit" className="btn" onClick={getData}>
          Submit
        </button>
      </div>
      {name && (
        <div id="wth_div">
          <p id="name_p">{name}</p>
          {time.length > 0 && (
            <p id="time_p">
              當地時間：{String(time[0] % 24).padStart(2, "0")}:{" "}
              {String(time[1]).padStart(2, "0")}:{" "}
              {String(time[2]).padStart(2, "0")}
            </p>
          )}
          <div id="wth3_div">
            <span>溫度：{temp}°C</span>
            <span>體感溫度：{ftemp}°C</span>
            <span>濕度：{humid}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
