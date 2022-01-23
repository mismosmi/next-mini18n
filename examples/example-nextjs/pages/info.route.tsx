import type { NextPage } from "next";
import Link from "next/link";

const Info: NextPage<{}> = () => (
  <main>
    <h3>Info</h3>
    <p>
      <Link href="/">
        <a>Go Home</a>
      </Link>
    </p>
  </main>
);

export default Info;
