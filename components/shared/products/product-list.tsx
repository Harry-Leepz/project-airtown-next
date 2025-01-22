type ProductListProps = {
  data: any; // TODO: Define type
  title?: string;
};

export default function ProductList({ data, title }: ProductListProps) {
  return (
    <div className='my-10'>
      <h2 className='h2-bold mb-4'>{title}</h2>
      {data.length === 0 && <p>No products found</p>}
      {data.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {data.map((product: any) => (
            <p key={product.name}>{product.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}
