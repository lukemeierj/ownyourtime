import os
with open("alltext.txt", 'w') as out: 
    for filename in os.listdir('./'):
        if filename != "URI.js" and 'jquery' not in filename and not filename.endswith('jpg') and not filename.endswith('png'): 
            print(filename)
            out.write(filename)
            out.write('\n')
            with open(filename, 'r') as reader:
                out.write(reader.read())
        else:
            continue
