# Paso 1: Crear un mapping de chunks a hashes
def crear_mapping_de_chunks(file_path):
    chunk_to_hash = {}
    with open(file_path, 'r') as file:
        for line in file:
            if ': ' in line:
                chunk_name, hash_cid = line.strip().split(': ', 1)
                chunk_to_hash[chunk_name] = hash_cid
    return chunk_to_hash

# Paso 2: Reemplazar los nombres de chunks en el segundo archivo usando el mapping
def reemplazar_chunks_con_hashes(input_file_path, output_file_path, mapping):
    with open(input_file_path, 'r') as file:
        lines = file.readlines()

    with open(output_file_path, 'w') as file:
        for line in lines:
            # Identificar líneas que contienen nombres de chunks
            if 'patron a buscar' in line.strip() and line.strip().endswith('.ts'):
                chunk_name = line.strip()
                if chunk_name in mapping:
                    # Reemplazar el nombre del chunk con su hash CID
                    line = line.replace(chunk_name, f'https://ipfs.io/ipfs/{mapping[chunk_name]}')
            file.write(line)

# Rutas a los archivos
archivo_hashes = ''
archivo_m3u8 = ''
archivo_salida = ''

# Crear el mapping y procesar el archivo m3u8
mapping_de_chunks = crear_mapping_de_chunks(archivo_hashes)
reemplazar_chunks_con_hashes(archivo_m3u8, archivo_salida, mapping_de_chunks)

print(f'Archivo M3U8 actualizado y guardado como {archivo_salida}.')
