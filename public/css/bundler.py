import os
import glob

# Define the path to your CSS directory
css_dir = './public/css'  # Change this to your actual path
output_file = './public/css/bundle.css'  # Path where the bundled file will be saved

# Recursively find all .css files in the directory and its subdirectories
css_files = glob.glob(os.path.join(css_dir, '**', '*.css'), recursive=True)

# Open the output file for writing
with open(output_file, 'w') as outfile:
    # Loop through each CSS file
    for css_file in css_files:
        print(f'Processing file: {os.path.basename(css_file)}')  # Print the file name
        with open(css_file, 'r') as infile:
            # Read the contents of the file and write it to the output file
            outfile.write(infile.read() + '\n')

print(f"CSS files bundled into {output_file}")
