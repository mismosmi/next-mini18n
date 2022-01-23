import { Link, useParams } from "remix";

export default function Info() {
  const params = useParams();

  return (
    <div>
      <h3>Info</h3>
      <Link to={`/${params.locale}`}>Go Home</Link>
    </div>
  );
}
