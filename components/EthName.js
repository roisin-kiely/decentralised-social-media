import { useState, useEffect } from "react";
import { web3 } from '../lib/web3';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import ENS, { getEnsAddress } from '@ensdomains/ensjs';

const ens = new ENS({
  provider: web3.currentProvider,
  ensAddress: getEnsAddress("1"), // Assuming you want the mainnet address
});

const EthName = ({ address }) => {
  const [name, setName] = useState();
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    const fetchEnsName = async () => {
      try {
        const n = await ens.getName(address);
        if (n.name) {
          setName(n.name); // Set ENS name if found
        } else {
          setName(null); // Handle unregistered ENS
        }
      } catch (error) {
        console.error("Error fetching ENS name:", error);
        setName(null); // Handle errors (e.g., address not registered)
      }
    };

    if (address) {
      fetchEnsName();
    }
  }, [address]); // Run only when address changes

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (name) {
          const a = await ens.name(name).getText("avatar");
          if (a) {
            setAvatar(a);
          }
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    if (name) {
      fetchAvatar();
    }
  }, [name]); // Run only when ENS name is resolved

  const formattedAddress = `${address.substr(0, 8)}...${address.substr(-4)}`;

  const icon = (
    <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />
  );

  return (
    <div className="eth-name">
      <div className="icon">
        {avatar ? (
          <img src={avatar} alt="avatar" />
        ) : (
          icon
        )}
      </div>

      <div className="name">
        <span className="primary">
          {name ? name : formattedAddress}
        </span>
        <span className="secondary">
          {name ? formattedAddress : ""}
        </span>
      </div>
    </div>
  );
};

export default EthName;
