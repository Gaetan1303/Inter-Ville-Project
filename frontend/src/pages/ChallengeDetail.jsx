import React from "react";
import { useParams } from "react-router-dom";

const ChallengeDetail = () => {
  const { id } = useParams();
  return <div>on est sur le challenge {id}</div>;
};

export default ChallengeDetail;
