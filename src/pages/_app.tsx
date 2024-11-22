import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {  OrderProvider } from './OrderProvider/orderContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
  <OrderProvider>
  <Component {...pageProps} />;
  </OrderProvider>
  );
}
