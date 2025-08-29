import { Supplier } from '~/modules/supplier/entities/supplier.entity';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

type OmitSupplier = Omit<Supplier, 'id' | 'category' | 'inventories'>;

export class SupplierSeeder implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<void> {
    const supplierRepo = dataSource.getRepository('Supplier');

    const mockSuppliers: OmitSupplier[] = [
      {
        name: 'John Supplier',
        address: 'Jl. Merpati No. 99, RT.1/RW.2, Cilandak, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430',
        phone: '0875678216',
        email: 'johnsupplier@gmail.com',
        is_active: true,
        category_id: 1,
      },
      {
        name: 'Jane Supplier',
        address: 'Jl. Merpati No. 101, RT.1/RW.2, Cilandak, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430',
        phone: '0875678217',
        email: 'janesupplier@gmail.com',
        is_active: true,
        category_id: 2,
      },
      {
        name: 'Bob Supplier',
        address: 'Jl. Merpati No. 103, RT.1/RW.2, Cilandak, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430',
        phone: '0875678218',
        email: 'bobsupplier@gmail.com',
        is_active: true,
        category_id: 3,
      },
      {
        name: 'Alice Supplier',
        address: 'Jl. Merpati No. 105, RT.1/RW.2, Cilandak, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430',
        phone: '0875678219',
        email: 'alicesupplier@gmail.com',
        is_active: true,
        category_id: 4,
      },
      {
        name: 'Eve Supplier',
        address: 'Jl. Merpati No. 107, RT.1/RW.2, Cilandak, Kec. Cilandak, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12430',
        phone: '0875678220',
        email: 'evesupplier@gmail.com',
        is_active: true,
        category_id: 5,
      },
    ];

    await supplierRepo.insert(mockSuppliers);
    console.log('✅ Seed supplier successfully');
  }
}
