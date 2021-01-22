import React, {useState, useEffect} from "react";
import { useHistory} from "react-router-dom";

import {MoviePreviewData } from "../../types";
import {PageContainer, ImageGridItem} from "../../components";
import {ActionRateGroupButtons} from "../../layout";
import {getUnratedRandomMovie, registerRate } from "../../api";

interface RateProps {

}

const Rate: React.FC<RateProps> =() => {
  let history = useHistory();

  const [unratedMovie, setUnratedMovie] = useState< MoviePreviewData| undefined>(undefined);
  const [rate, setRate] = useState< number | undefined>(undefined);

  const handleSaveRate = () => {
    const response = unratedMovie && registerRate(unratedMovie.id, rate as number);
    if (response){
      loadRandomMovie();
      setRate(undefined);
    }
  };

  const handleClickStar =(value:number)=> {
    setRate(value);
  };

  const loadRandomMovie = async () => {
    const movie = await getUnratedRandomMovie();
    if (movie){
      setUnratedMovie(movie as MoviePreviewData);
    } else {
      history.push("/welcome");
    }
  };

  useEffect(()=>{
    loadRandomMovie();
  },[]);

  return (
    <PageContainer title="Rate random movies" >
      <ImageGridItem item={unratedMovie} />
      <ActionRateGroupButtons 
        rate={rate}
        loadRandomMovie={loadRandomMovie}
        setRate={setRate} 
        handleSaveRate={handleSaveRate}
        handleClickStar={handleClickStar}
      />
    </PageContainer>
  );
};
export default Rate;
