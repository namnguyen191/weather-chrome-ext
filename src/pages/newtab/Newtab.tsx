import '@pages/newtab/Newtab.css';
import '@pages/newtab/Newtab.scss';

const Newtab = () => {
  const generateVapour = () => {
    const vaporDelay = [
      1, 3, 16, 5, 13, 20, 6, 7, 10, 8, 17, 11, 12, 14, 2, 9, 15, 4, 19,
    ];

    return vaporDelay.map((de) => {
      return (
        <span key={de} style={{ animationDelay: `calc(${de} * -0.5s)` }}></span>
      );
    });
  };

  return (
    <div className="hotCupOfTeaContainer">
      <div className="container">
        <div className="plate"></div>
        <div className="cup">
          <div className="top">
            <div className="vapour">{generateVapour()}</div>
            <div className="circle">
              <div className="tea"></div>
            </div>
          </div>
          <div className="handle"></div>
        </div>
        <h1 className="title">Cappuchouno</h1>
      </div>
    </div>
  );
};

export default Newtab;
