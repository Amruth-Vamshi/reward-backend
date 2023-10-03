import { MigrationInterface, QueryRunner, In } from "typeorm";
import { MetricFilterSeed } from "./data/metric_filter_seed";
import { MetricFilter } from "@walkinserver/walkin-core/src/entity";
import { updateEntity } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

export class MetricFilters1569832635035 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    for (const metricFilterSeed of MetricFilterSeed) {
      let metricFilter = new MetricFilter();
      metricFilter = updateEntity(metricFilter, metricFilterSeed);
      metricFilter = await metricFilter.save();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const metricFilters = MetricFilterSeed.map(
      metricFilter => metricFilter.key
    );
    const savedMetricFilters = await MetricFilter.find({
      where: {
        key: In(metricFilters)
      }
    });
    for (const metricFilter of savedMetricFilters) {
      await metricFilter.remove();
    }
  }
}
