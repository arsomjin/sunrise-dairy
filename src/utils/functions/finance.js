import { Col, Row } from 'antd';
import { ReactComponent as ETHIcon } from 'assets/icons/eth.svg';
import { ReactComponent as BTCIcon } from 'assets/icons/btc.svg';

export const getCurrencyPrice = (price, currency, isIcon = true) => {
  switch (currency) {
    case 'USD': {
      return isIcon ? `$${price}` : `${price} USD`;
    }

    case 'BTC': {
      return isIcon ? (
        <Row align="middle" gutter={[8, 8]}>
          <Col style={{ display: 'flex' }}>
            <BTCIcon />
          </Col>

          <Col>{price}</Col>
        </Row>
      ) : (
        `${price} BTC`
      );
    }

    case 'ETH': {
      return isIcon ? (
        <Row align="middle" gutter={[8, 8]}>
          <Col style={{ display: 'flex' }}>
            <ETHIcon />
          </Col>

          <Col>{price}</Col>
        </Row>
      ) : (
        `${price} ETH`
      );
    }

    default: {
      return isIcon ? `$${price}` : `${price} USD`;
    }
  }
};
