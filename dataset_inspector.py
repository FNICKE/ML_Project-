import pandas as pd
import json

datasets = ['database.csv', 'forestfires.csv', 'landslides.csv', 'tsunami_dataset.csv']

output = {}
for d in datasets:
    try:
        df = pd.read_csv(f'datasets/{d}')
        output[d] = {
            'shape': df.shape,
            'columns': list(df.columns),
            'target_candidates': [c for c in df.columns if any(word in c.lower() for word in ['target', 'class', 'label', 'risk', 'magnitude', 'mag', 'status', 'prob', 'flood', 'fire', 'area', 'tsunami', 'landslide'])]
        }
    except Exception as e:
        output[d] = str(e)

with open('dataset_info.json', 'w') as f:
    json.dump(output, f, indent=4)
