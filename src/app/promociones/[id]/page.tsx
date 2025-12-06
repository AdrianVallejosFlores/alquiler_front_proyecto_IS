import PageProm from "../pageProm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <PageProm ID_OFERTA={id} />;
}