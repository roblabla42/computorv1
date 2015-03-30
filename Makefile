# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: roblabla </var/spool/mail/roblabla>        +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2015/03/30 16:02:07 by roblabla          #+#    #+#              #
#    Updated: 2015/03/30 16:16:52 by roblabla         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = computor

all: $(NAME)

$(NAME):
	npm i
	echo '#!/bin/sh' > ./computor
	echo 'node ./computor.js "$$@"' >> ./computor
	chmod +x ./computor

clean:
	rm -rf node_modules

fclean: clean
	rm computor

re: fclean all

.PHONY: all clean fclean re
