import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x06Ea07E90F1cca5027f665799f22481Bb8fA1F7F'
);

export default instance;