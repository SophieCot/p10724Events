import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Tri des événements par date (ordre croissant)
  const byDateDesc = data?.focus?.length ? data.focus.sort((evtA, evtB) => 
   // ancien code => new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
 // Correction pour afficher du plus ancien au plus récent
  new Date(evtB.date) - new Date(evtA.date))
  : [];
  
   /** ancien code => 
   * const nextCard = () => {
   * setTimeout(
   * () => setIndex(index < byDateDesc.length ? index + 1 : 0),
   * 5000
   * );
   * };
  */    

  // Gestion automatique du changement de slide avec setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % byDateDesc.length);
    }, 5000); // Intervalle de 5 secondes pour passer au prochain événement

    return () => clearInterval(interval); // Nettoyage de l'intervalle à la fin de l'effet
  }, [byDateDesc.length]); // Ne se déclenche que lorsque le nombre d'éléments change

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        //  Utilisation d'un identifiant unique 
        <div key={event.id || idx}  className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}> 
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      {/* Correction de la pagination (boutons radio) */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((_, radioIdx) => (
             // Correction : Clé `key` corrigée pour éviter l'erreur React "Do not use array index in keys"
            // Maintenant : `key={byDateDesc[radioIdx].id || radioIdx}`
            <div key={byDateDesc[radioIdx].id || radioIdx}>
              <input
                type="radio"
                id={`radio-${radioIdx}`}
                name="radio-button"
                checked={index === radioIdx}
                onChange={() => setIndex(radioIdx)} // Correction : Ajout de onChange() pour rendre le bouton fonctionnel
              />
              <label htmlFor={`radio-${radioIdx}`}>{`Option ${radioIdx + 1}`}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;






