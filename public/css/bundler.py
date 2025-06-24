import os
import glob

css_dir = './public/css'
output_file = './public/css/bundle.css'

css_files = [
    f for f in glob.glob(os.path.join(css_dir, '**', '*.css'), recursive=True)
    if os.path.basename(f) != 'main.css'
]

with open(output_file, 'w') as outfile:
    for css_file in css_files:
        print(f'Processing file: {os.path.relpath(css_file, css_dir)}')
        with open(css_file, 'r') as infile:
            for line in infile:
                stripped = line.strip()
                if stripped:  # Only write non-empty, non-whitespace lines
                    outfile.write(stripped)
                    # outfile.write(stripped + '\n')

print(f"CSS files bundled into {output_file}")