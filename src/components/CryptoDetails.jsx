import React, {useState} from 'react'
import HTMLReactParser from 'html-react-parser'
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';

import Loader from './Loader';
import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';

import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
    const { coinId } = useParams();
    const [timePeriod, settimePeriod] = useState('7d');
    const { data, isFetching } = useGetCryptoDetailsQuery(coinId)
    const { data: coinHistory } = useGetCryptoHistoryQuery({coinId, timePeriod})
    const CryptoDetails = data?.data?.coin;

    console.log(CryptoDetails)
    console.log(coinHistory)

    if (isFetching) return <Loader />

    const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

    const stats = [
      { title: 'Price to USD', value: `$ ${CryptoDetails.price && millify(CryptoDetails.price)}`, icon: <DollarCircleOutlined /> },
      { title: 'Rank', value: CryptoDetails.rank, icon: <NumberOutlined /> },
      { title: '24h Volume', value: `$ ${CryptoDetails.volume && millify(CryptoDetails.volume)}`, icon: <ThunderboltOutlined /> },
      { title: 'Market Cap', value: `$ ${CryptoDetails.marketCap && millify(CryptoDetails.marketCap)}`, icon: <DollarCircleOutlined /> },
      { title: 'All-time-high(daily avg.)', value: `$ ${millify(CryptoDetails.allTimeHigh.price)}`, icon: <TrophyOutlined /> },
    ];
  
    const genericStats = [
      { title: 'Number Of Markets', value: CryptoDetails.numberOfMarkets, icon: <FundOutlined /> },
      { title: 'Number Of Exchanges', value: CryptoDetails.numberOfExchanges, icon: <MoneyCollectOutlined /> },
      { title: 'Aprroved Supply', value: CryptoDetails.approvedSupply ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
      { title: 'Total Supply', value: `$ ${millify(CryptoDetails.totalSupply)}`, icon: <ExclamationCircleOutlined /> },
      { title: 'Circulating Supply', value: `$ ${millify(CryptoDetails.circulatingSupply)}`, icon: <ExclamationCircleOutlined /> },
    ];
  

    return (
        <Col className="coin-detail-container">
            <Col className="coin-heading-container">
            
                <Title level={2} className="coin-name">
                    {CryptoDetails.name} ({CryptoDetails.slug}) Price
                    <p>
                        {CryptoDetails.name} liveprice in US dollars.
                        View value statics, market cap and supply.
                    </p>
                </Title>
            </Col>
                <Select defaultValue="7d" className="select-timePeriod" placeholder="Select Time Period" onChange={(value) => settimePeriod(value)}>
                    {time.map((date) => <Option key={date}>{date}</Option>)}
                </Select>

                <LineChart coinHistory={coinHistory} currentPrice={millify(CryptoDetails.price)} coinName={CryptoDetails.name} />

                <Col className="stats-container">
                    <Col className="coin-value-statistics" >
                        <Col className="coin-value-statistics-heading">
                            <Title level={3} className="coin-details-heading">
                                {CryptoDetails.name} Value statistics
                            </Title>
                            <p>
                                An overview showing the stats of {CryptoDetails.name}
                            </p>
                        </Col>
                        {stats.map(({icon, title, value}) => (
                            <Col> 
                                <Col className="coin-stats-name" >
                                    <Text>{icon}</Text>
                                    <Text>{title}</Text>
                                </Col>
                                <Text className="stats">{value}</Text>
                            </Col>
                        ))}
                    </Col>
                    <Col className="other-stats-info" >
                        <Col className="coin-value-statistics-heading">
                            <Title level={3} className="coin-details-heading">
                                Other Statistics
                            </Title>
                            <p>
                                An overview showing the stats of all cryptocurrencies
                            </p>
                        </Col>
                        {genericStats.map(({icon, title, value}) => (
                            <Col> 
                                <Col className="coin-stats-name" >
                                    <Text>{icon}</Text>
                                    <Text>{title}</Text>
                                </Col>
                                <Text className="stats">{value}</Text>
                            </Col>
                        ))}
                    </Col>
                </Col>
                <Col className="coin-desc-link">
                    <Row className="coin-desc">
                        <Title level={3} className="coin-details-heading">
                            What is {CryptoDetails.name}?
                            {HTMLReactParser(CryptoDetails.description)}
                        </Title>
                    </Row>
                    <Col className="coin-links">
                        <Title level={3} className="coin-details-heading" >
                            {CryptoDetails.name} Links
                        </Title>
                        {CryptoDetails.links.map((link) => (
                            <Row className="coin-link" key="{link.name}">
                                <Title  level={5} className="link-name">
                                    {link.type}
                                </Title>
                                <a href={link.url} target="_blank" rel="noreferrer">
                                    {link.name}
                                </a>
                            </Row>
                        ))}
                    </Col>
                </Col>
        </Col>
    )
}

export default CryptoDetails
