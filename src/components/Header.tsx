import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Menu, X } from 'lucide-react';
import BreadIcon from './icons/BreadIcon';
// import { HederaWalletsProvider, useHashPackWallet } from '@hashgraph/hedera-wallet-connect';

// const WalletButton = () => {
//   const { connect, disconnect, isConnected, accountId } = useHashPackWallet();
//   return isConnected ? (
//     <Button variant="outline" className="ml-4" onClick={disconnect}>{accountId}</Button>
//   ) : (
//     <Button className="ml-4 bg-bread-500 text-white hover:bg-bread-600" onClick={connect}>Connect Wallet</Button>
//   );
// };

const HeaderContent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BreadIcon className="h-6 w-6 text-bread-500" />
          <Link to="/" className="text-xl font-bold text-bread-700">
            Bread Rescue
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-bread-500 transition-colors">
            Home
          </Link>
          <Link to="/bakeries" className="text-sm font-medium hover:text-bread-500 transition-colors">
            Bakeries
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-bread-500 transition-colors">
            About
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <Link to="/auth">
            <Button className="bg-bread-500 text-white hover:bg-bread-600">
              Connect
            </Button>
          </Link>
          {/* <WalletButton /> */}
        </nav>

        <button 
          className="flex md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>

        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg p-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-sm font-medium hover:text-bread-500 transition-colors">
                Home
              </Link>
              <Link to="/bakeries" className="text-sm font-medium hover:text-bread-500 transition-colors">
                Bakeries
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-bread-500 transition-colors">
                About
              </Link>
              <Separator className="my-2" />
              <Button className="bg-bread-500 text-white hover:bg-bread-600 w-full" asChild>
                <Link to="/auth">Connect</Link>
              </Button>
              {/* <WalletButton /> */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// const Header = () => (
//   <HederaWalletsProvider>
//     <HeaderContent />
//   </HederaWalletsProvider>
// );

const Header = HeaderContent;

export default Header;
